import { Request, Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import { AppError } from '../middleware/errorHandler'
import { EmailService } from '../services/email.service'
import { WhatsAppService } from '../services/whatsapp.service'
import { NotificationService } from '../services/notification.service'

/**
 * CRM Lead Controller — handles all lead/enquiry lifecycle.
 * Every form submission (website, walk-in, phone, social media)
 * goes through this controller.
 */
export class LeadController {
  /**
   * @POST /api/leads
   * Create a new lead (public endpoint for website forms + internal for staff)
   */
  static async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        name, phone, email, address, age, gender, goal, preferredTime,
        source = 'website', message, utmSource, utmMedium, utmCampaign,
        assignedTo, priority = 'medium',
      } = req.body

      // Check for duplicate lead (same phone, same branch, last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const existingLead = await Lead.findOne({
        phone: phone.trim(),
        branch: req.body.branch || process.env.DEFAULT_BRANCH_ID,
        createdAt: { $gte: thirtyDaysAgo },
      })

      if (existingLead) {
        // Update existing lead instead of duplicate
        existingLead.followUpHistory.push({
          date: new Date(),
          note: `Duplicate enquiry received. Source: ${source}`,
          by: req.user?.id as any,
          status: existingLead.status,
        })
        if (message) existingLead.remarks = message
        await existingLead.save()

        res.status(200).json({
          success: true,
          message: 'Enquiry updated.',
          data: { leadId: existingLead._id },
        })
        return
      }

      // Create new lead
      const lead = await Lead.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim(),
        address: address?.trim(),
        age,
        gender,
        goal,
        preferredTime,
        source,
        status: 'new',
        message: message?.trim(),
        utmSource,
        utmMedium,
        utmCampaign,
        assignedTo,
        priority,
        branch: req.body.branch || process.env.DEFAULT_BRANCH_ID,
        createdBy: req.user?.id,
        tags: [],
      })

      // ─── Async: Trigger notifications ───
      setImmediate(async () => {
        try {
          // Send confirmation to lead
          if (email) {
            await EmailService.sendLeadConfirmation({ name, email, goal, source })
          }

          // WhatsApp to lead
          if (phone && source === 'website') {
            await WhatsAppService.sendLeadConfirmation(phone, name)
          }

          // Notify admin
          await NotificationService.notifyNewLead(lead._id.toString(), name, source)
          await WhatsAppService.notifyAdminNewLead(name, phone, source)

        } catch (notifyError) {
          console.error('Lead notification error:', notifyError)
          // Don't fail the request for notification errors
        }
      })

      res.status(201).json({
        success: true,
        message: 'Enquiry received! Our team will contact you shortly.',
        data: { leadId: lead._id },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @GET /api/leads
   * Get all leads with filtering, search, pagination
   */
  static async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        source,
        search,
        assignedTo,
        priority,
        followUpDate,
        startDate,
        endDate,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query

      const filter: any = { branch: req.user?.branch || req.query.branch }

      if (status) filter.status = status
      if (source) filter.source = source
      if (assignedTo) filter.assignedTo = assignedTo
      if (priority) filter.priority = priority
      if (followUpDate) {
        const date = new Date(followUpDate as string)
        filter.followUpDate = {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lte: new Date(date.setHours(23, 59, 59, 999)),
        }
      }
      if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate as string)
        if (endDate) filter.createdAt.$lte = new Date(endDate as string)
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }

      const pageNum = parseInt(page as string)
      const limitNum = Math.min(parseInt(limit as string), 100)
      const skip = (pageNum - 1) * limitNum

      const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 }

      const [leads, total] = await Promise.all([
        Lead.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limitNum)
          .populate('assignedTo', 'name email')
          .populate('convertedToMember', 'memberId name')
          .lean(),
        Lead.countDocuments(filter),
      ])

      res.json({
        success: true,
        data: leads,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @GET /api/leads/:id
   * Get a single lead by ID
   */
  static async getLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findById(req.params.id)
        .populate('assignedTo', 'name email avatar')
        .populate('convertedToMember', 'memberId name')
        .populate('followUpHistory.by', 'name')
        .populate('createdBy', 'name')

      if (!lead) throw new AppError('Lead not found', 404)

      res.json({ success: true, data: lead })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @PATCH /api/leads/:id
   * Update lead status, assign, add follow-up note
   */
  static async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findById(req.params.id)
      if (!lead) throw new AppError('Lead not found', 404)

      const { status, assignedTo, remarks, followUpDate, priority, note, tags } = req.body

      if (status && status !== lead.status) {
        // Track status change in follow-up history
        lead.followUpHistory.push({
          date: new Date(),
          note: note || `Status changed from ${lead.status} to ${status}`,
          by: req.user!.id as any,
          status,
        })
        lead.status = status
      }

      if (assignedTo !== undefined) lead.assignedTo = assignedTo
      if (remarks !== undefined) lead.remarks = remarks
      if (followUpDate !== undefined) lead.followUpDate = new Date(followUpDate)
      if (priority !== undefined) lead.priority = priority
      if (tags !== undefined) lead.tags = tags

      // If adding a note without status change
      if (note && !status) {
        lead.followUpHistory.push({
          date: new Date(),
          note,
          by: req.user!.id as any,
          status: lead.status,
        })
      }

      await lead.save()

      res.json({ success: true, message: 'Lead updated', data: lead })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @DELETE /api/leads/:id
   * Delete a lead (admin/manager only)
   */
  static async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await Lead.findByIdAndDelete(req.params.id)
      if (!lead) throw new AppError('Lead not found', 404)
      res.json({ success: true, message: 'Lead deleted' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @POST /api/leads/bulk-action
   * Bulk update: status change, assign, delete
   */
  static async bulkAction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids, action, data } = req.body

      if (!ids?.length) throw new AppError('No leads selected', 400)

      let result
      switch (action) {
        case 'delete':
          result = await Lead.deleteMany({ _id: { $in: ids } })
          break
        case 'update-status':
          result = await Lead.updateMany(
            { _id: { $in: ids } },
            { $set: { status: data.status } }
          )
          break
        case 'assign':
          result = await Lead.updateMany(
            { _id: { $in: ids } },
            { $set: { assignedTo: data.assignedTo } }
          )
          break
        default:
          throw new AppError('Invalid bulk action', 400)
      }

      res.json({ success: true, message: `Bulk action completed`, result })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @GET /api/leads/stats
   * CRM pipeline stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = req.user?.branch || req.query.branch

      const branchId = new (require('mongoose').Types.ObjectId)(branch as string)

      const [statusStats, sourceStats, todayLeads, thisMonthLeads] = await Promise.all([
        Lead.aggregate([
          { $match: { branch: branchId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),
        Lead.aggregate([
          { $match: { branch: new (require('mongoose').Types.ObjectId)(branch as string) } },
          { $group: { _id: '$source', count: { $sum: 1 } } },
        ]),
        Lead.countDocuments({
          branch: branchId,
          createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        }),
        Lead.countDocuments({
          branch: branchId,
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        }),
      ])

      res.json({
        success: true,
        data: {
          byStatus: Object.fromEntries(statusStats.map(s => [s._id, s.count])),
          bySource: Object.fromEntries(sourceStats.map(s => [s._id, s.count])),
          todayLeads,
          thisMonthLeads,
        },
      })
    } catch (error) {
      next(error)
    }
  }
}
