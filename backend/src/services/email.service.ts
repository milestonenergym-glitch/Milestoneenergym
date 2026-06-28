/**
 * Service stub — full implementation in Phase 3.
 * These services handle email, WhatsApp, and push notifications.
 */
export class EmailService {
  static async sendLeadConfirmation(data: any): Promise<void> {
    console.log('[EMAIL] Lead confirmation to:', data.email)
  }
  static async sendWelcomeEmail(data: any): Promise<void> {
    console.log('[EMAIL] Welcome email to:', data.email)
  }
  static async sendMembershipConfirmation(data: any): Promise<void> {
    console.log('[EMAIL] Membership confirmation to:', data.email)
  }
  static async sendRenewalReminder(data: any): Promise<void> {
    console.log('[EMAIL] Renewal reminder to:', data.email)
  }
  static async sendBirthdayWishes(data: any): Promise<void> {
    console.log('[EMAIL] Birthday wishes to:', data.email)
  }
}

export class WhatsAppService {
  private static readonly adminNumber = process.env.ADMIN_WHATSAPP || '+918875305442'
  static async sendLeadConfirmation(phone: string, name: string): Promise<void> {
    console.log('[WHATSAPP] Lead confirmation to:', phone)
  }
  static async notifyAdminNewLead(name: string, phone: string, source: string): Promise<void> {
    console.log(`[WHATSAPP] Admin notified: New lead ${name} from ${source}`)
  }
  static async sendRenewalReminder(phone: string, name: string, daysLeft: number): Promise<void> {
    console.log('[WHATSAPP] Renewal reminder to:', phone, 'days left:', daysLeft)
  }
}

export class NotificationService {
  static async notifyNewLead(leadId: string, name: string, source: string): Promise<void> {
    console.log('[NOTIFICATION] New lead:', leadId, name, source)
  }
  static async notifyPaymentReceived(paymentId: string, amount: number): Promise<void> {
    console.log('[NOTIFICATION] Payment received:', paymentId, amount)
  }
}
