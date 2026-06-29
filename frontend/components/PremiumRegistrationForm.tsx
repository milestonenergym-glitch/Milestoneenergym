'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createMember } from '@/app/actions/members'
import { markLinkAsUsed } from '@/app/actions/registration-links'

export default function PremiumRegistrationForm({ 
  token, 
  isAdmin,
  dbPlans = []
}: { 
  token?: string, 
  isAdmin?: boolean,
  dbPlans?: any[]
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMemberId, setSuccessMemberId] = useState('')
  
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedPlanType, setSelectedPlanType] = useState<'db' | 'custom' | ''>('')
  const [selectedDbPlan, setSelectedDbPlan] = useState<any>(null) // full plan object from DB
  const [customMonths, setCustomMonths] = useState('')
  const [amountPaid, setAmountPaid] = useState('')   // actual amount (for admin dashboard)
  const [pdfAmount, setPdfAmount] = useState('')     // PDF/contract display amount
  const [payMode, setPayMode] = useState('CASH')
  const [endDate, setEndDate] = useState('')

  // Recalculate end date whenever start date, plan or custom months change
  useEffect(() => {
    if (!startDate) { setEndDate(''); return }
    let months = 0
    if (selectedPlanType === 'db' && selectedDbPlan) {
      // Use durationInDays if available, else derive from plan name patterns
      months = selectedDbPlan.durationInDays ? Math.round(selectedDbPlan.durationInDays / 30) : 1
    } else if (selectedPlanType === 'custom' && customMonths) {
      months = parseInt(customMonths, 10)
    }
    if (months > 0) {
      const end = new Date(startDate)
      end.setDate(end.getDate() + (months * 30))
      setEndDate(end.toISOString().split('T')[0])
    } else {
      setEndDate('')
    }
  }, [startDate, selectedPlanType, selectedDbPlan, customMonths])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (selectedPlanType === '') {
      toast.error('Please select a Membership Plan.')
      return
    }
    if (selectedPlanType === 'custom' && !customMonths) {
      toast.error('Please select a custom duration.')
      return
    }
    
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    // Determine plan details
    let durationMonths = 1
    let durationInDays = 30
    let planId: string | undefined = undefined
    if (selectedPlanType === 'db' && selectedDbPlan) {
      planId = selectedDbPlan.id
      durationMonths = selectedDbPlan.durationInDays ? Math.round(selectedDbPlan.durationInDays / 30) : 1
      durationInDays = selectedDbPlan.durationInDays || 30
    } else if (selectedPlanType === 'custom') {
      durationMonths = parseInt(customMonths, 10)
      durationInDays = durationMonths * 30
    }

    const data = {
      name: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      gender: formData.get('gender'),
      dateOfBirth: formData.get('dob') ? new Date(formData.get('dob') as string) : undefined,
      bloodGroup: formData.get('bloodGroup'),
      address: formData.get('address'),
      emergencyContact: formData.get('emergName'),
      emergencyContactPhone: formData.get('emergPhone'),
      medicalConditions: formData.get('medical'),
      planId,
      durationMonths,
      durationInDays,
      startDate: new Date(startDate),
      amountPaid: Number(amountPaid) || 0,
      pdfAmount: pdfAmount ? Number(pdfAmount) : null,
      paymentMode: payMode,
    }

    const res = await createMember(data)
    
    if (res.success) {
      if (token) {
        await markLinkAsUsed(token)
      }
      setSuccessMemberId('Redirecting...') // We don't have the exact ID here unless returned, wait createMember does return user
      setShowSuccess(true)
      
      // If admin, maybe redirect after a few seconds
      setTimeout(() => {
        if (isAdmin) {
          router.push('/admin/members')
          router.refresh()
        } else {
          router.refresh() // Will trigger the "Already Registered" view
        }
      }, 3000)
    } else {
      toast.error(res.error || 'Failed to complete registration')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        
        .premium-reg-wrapper {
          --navy:   #0B1F4B;
          --blue:   #1A4BD4;
          --gold:   #E6A817;
          --gold-lt:#F5C842;
          --white:  #FFFFFF;
          --off:    #F4F6FB;
          --border: #D0D9ED;
          --text:   #1C2640;
          --muted:  #6B7A99;
          --danger: #C0392B;
          
          font-family: 'Barlow', sans-serif;
          background: var(--off);
          color: var(--text);
          min-height: 100vh;
          padding: 32px 16px 64px;
        }

        .premium-reg-wrapper * { box-sizing: border-box; }

        .premium-reg-wrapper .page {
          max-width: 820px;
          margin: 0 auto;
          background: var(--white);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(11,31,75,.14);
        }

        .premium-reg-wrapper .header {
          background: var(--navy);
          padding: 28px 40px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }
        .premium-reg-wrapper .header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-lt) 60%, transparent 100%);
        }
        .premium-reg-wrapper .logo-box {
          width: 72px; height: 72px;
          background: var(--gold);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 22px;
          color: var(--navy); letter-spacing: -1px;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(230,168,23,.4);
        }
        .premium-reg-wrapper .brand h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 30px;
          color: var(--white);
          letter-spacing: 1px;
          text-transform: uppercase;
          line-height: 1;
          margin: 0;
        }
        .premium-reg-wrapper .brand h1 span { color: var(--gold); }
        .premium-reg-wrapper .brand p {
          font-size: 12.5px;
          color: rgba(255,255,255,.6);
          margin-top: 5px;
          line-height: 1.5;
          margin-bottom: 0;
        }
        .premium-reg-wrapper .header-meta {
          margin-left: auto;
          text-align: right;
          flex-shrink: 0;
        }
        .premium-reg-wrapper .header-meta .date {
          font-size: 12px;
          color: rgba(255,255,255,.5);
          text-transform: uppercase;
          letter-spacing: .8px;
        }
        .premium-reg-wrapper .member-badge {
          background: var(--gold);
          color: var(--navy);
          font-weight: 700;
          font-size: 11px;
          padding: 4px 12px;
          border-radius: 20px;
          margin-top: 6px;
          display: inline-block;
          letter-spacing: .5px;
        }

        .premium-reg-wrapper .form-title {
          background: var(--blue);
          padding: 14px 40px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .premium-reg-wrapper .form-title .bar {
          width: 4px; height: 22px;
          background: var(--gold);
          border-radius: 2px;
        }
        .premium-reg-wrapper .form-title h2 {
          font-size: 15px;
          font-weight: 700;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin: 0;
        }

        .premium-reg-wrapper .form-body {
          padding: 36px 40px;
        }

        .premium-reg-wrapper .section {
          margin-bottom: 36px;
        }
        .premium-reg-wrapper .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .premium-reg-wrapper .section-label .dot {
          width: 10px; height: 10px;
          background: var(--gold);
          border-radius: 50%;
          flex-shrink: 0;
        }
        .premium-reg-wrapper .section-label span {
          font-size: 11px;
          font-weight: 700;
          color: var(--blue);
          text-transform: uppercase;
          letter-spacing: 1.8px;
        }
        .premium-reg-wrapper .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .premium-reg-wrapper .grid-row { display: grid; gap: 18px; }
        .premium-reg-wrapper .grid-2 { grid-template-columns: 1fr 1fr; }
        .premium-reg-wrapper .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        .premium-reg-wrapper .span-2 { grid-column: span 2; }
        .premium-reg-wrapper .span-3 { grid-column: span 3; }

        .premium-reg-wrapper .field label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 7px;
        }
        .premium-reg-wrapper .field label .req { color: var(--danger); margin-left: 2px; }

        .premium-reg-wrapper .field input,
        .premium-reg-wrapper .field select,
        .premium-reg-wrapper .field textarea {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          font-size: 14.5px;
          font-family: 'Barlow', sans-serif;
          color: var(--text);
          background: var(--off);
          transition: border-color .18s, box-shadow .18s, background .18s;
          outline: none;
        }
        .premium-reg-wrapper .field select {
          appearance: auto;
        }
        .premium-reg-wrapper .field input:focus,
        .premium-reg-wrapper .field select:focus,
        .premium-reg-wrapper .field textarea:focus {
          border-color: var(--blue);
          background: var(--white);
          box-shadow: 0 0 0 3px rgba(26,75,212,.1);
        }
        .premium-reg-wrapper .field input::placeholder,
        .premium-reg-wrapper .field textarea::placeholder { color: #B0BAD0; }

        .premium-reg-wrapper .field textarea { resize: vertical; min-height: 72px; }

        .premium-reg-wrapper .plan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 4px;
        }
        .premium-reg-wrapper .plan-card {
          border: 2px solid var(--border);
          border-radius: 10px;
          padding: 16px 14px;
          cursor: pointer;
          transition: border-color .18s, background .18s, box-shadow .18s;
          text-align: center;
          position: relative;
        }
        .premium-reg-wrapper .plan-card input[type="radio"] { display: none; }
        .premium-reg-wrapper .plan-card:hover { border-color: var(--blue); }
        .premium-reg-wrapper .plan-card.selected {
          border-color: var(--gold);
          background: #FFFBF0;
          box-shadow: 0 2px 12px rgba(230,168,23,.18);
        }
        .premium-reg-wrapper .plan-card .plan-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: .6px;
          margin-bottom: 6px;
        }
        .premium-reg-wrapper .plan-card .plan-price {
          font-size: 20px;
          font-weight: 800;
          color: var(--blue);
        }
        .premium-reg-wrapper .plan-card .plan-price span {
          font-size: 12px;
          font-weight: 600;
          color: var(--muted);
        }
        .premium-reg-wrapper .plan-card.selected .plan-price { color: var(--gold); }
        .premium-reg-wrapper .plan-card .checkmark {
          position: absolute;
          top: 8px; right: 10px;
          font-size: 16px;
          display: none;
        }
        .premium-reg-wrapper .plan-card.selected .checkmark { display: block; }

        .premium-reg-wrapper .payment-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .premium-reg-wrapper .pay-opt {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 2px solid var(--border);
          border-radius: 8px;
          padding: 10px 18px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text);
          transition: border-color .18s, background .18s;
        }
        .premium-reg-wrapper .pay-opt input { display: none; }
        .premium-reg-wrapper .pay-opt:hover, .premium-reg-wrapper .pay-opt.selected {
          border-color: var(--blue);
          background: #EEF3FD;
          color: var(--blue);
        }
        .premium-reg-wrapper .pay-opt .icon { font-size: 18px; }

        .premium-reg-wrapper .tc-box {
          background: var(--off);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          border-radius: 8px;
          padding: 18px 20px;
          margin-bottom: 20px;
        }
        .premium-reg-wrapper .tc-box h4 {
          font-size: 12px;
          font-weight: 700;
          color: var(--navy);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          margin-top: 0;
        }
        .premium-reg-wrapper .tc-box ol {
          padding-left: 18px;
          list-style: decimal;
          margin: 0;
        }
        .premium-reg-wrapper .tc-box li {
          font-size: 12.5px;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 6px;
        }
        .premium-reg-wrapper .tc-box li strong { color: var(--text); }

        .premium-reg-wrapper .agree-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 24px;
          cursor: pointer;
        }
        .premium-reg-wrapper .agree-row input[type="checkbox"] {
          width: 18px; height: 18px;
          accent-color: var(--blue);
          margin-top: 2px;
          flex-shrink: 0;
          cursor: pointer;
        }
        .premium-reg-wrapper .agree-row p {
          font-size: 13px;
          color: var(--text);
          line-height: 1.55;
          margin: 0;
        }
        .premium-reg-wrapper .agree-row p em {
          font-style: italic;
          color: var(--navy);
          font-weight: 600;
        }

        .premium-reg-wrapper .sig-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 28px;
        }
        .premium-reg-wrapper .sig-block label {
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 8px;
        }
        .premium-reg-wrapper .sig-canvas-wrap {
          border: 1.5px dashed var(--border);
          border-radius: 8px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--off);
          color: #B0BAD0;
          font-size: 12.5px;
          position: relative;
        }

        .premium-reg-wrapper .submit-row {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .premium-reg-wrapper .btn-reset {
          padding: 13px 28px;
          border: 2px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--muted);
          background: transparent;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          transition: border-color .18s, color .18s;
        }
        .premium-reg-wrapper .btn-reset:hover { border-color: var(--text); color: var(--text); }

        .premium-reg-wrapper .btn-submit {
          padding: 13px 36px;
          background: linear-gradient(135deg, var(--blue) 0%, #1640A8 100%);
          color: var(--white);
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 800;
          font-family: 'Barlow', sans-serif;
          cursor: pointer;
          letter-spacing: .5px;
          text-transform: uppercase;
          box-shadow: 0 4px 16px rgba(26,75,212,.3);
          transition: transform .15s, box-shadow .15s;
        }
        .premium-reg-wrapper .btn-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(26,75,212,.38);
        }
        .premium-reg-wrapper .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .premium-reg-wrapper .form-footer {
          background: var(--navy);
          padding: 16px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .premium-reg-wrapper .form-footer p {
          font-size: 11.5px;
          color: rgba(255,255,255,.45);
          margin: 0;
        }
        .premium-reg-wrapper .form-footer .contact {
          font-size: 11.5px;
          color: var(--gold);
          font-weight: 600;
        }

        .success-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(11,31,75,.7);
          backdrop-filter: blur(4px);
          z-index: 100;
          align-items: center;
          justify-content: center;
        }
        .success-overlay.show { display: flex; }
        .success-card {
          background: var(--white);
          border-radius: 16px;
          padding: 48px 40px;
          text-align: center;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0,0,0,.3);
        }
        .success-icon {
          width: 72px; height: 72px;
          background: #ECFDF5;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          margin: 0 auto 20px;
          border: 2px solid #A7F3D0;
        }
        .success-card h3 {
          font-size: 22px;
          font-weight: 800;
          color: #0B1F4B;
          margin-bottom: 8px;
        }
        .success-card p {
          font-size: 14px;
          color: #6B7A99;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        @media (max-width: 640px) {
          .premium-reg-wrapper .header { flex-wrap: wrap; padding: 24px 20px 20px; }
          .premium-reg-wrapper .header-meta { margin-left: 0; }
          .premium-reg-wrapper .form-body { padding: 24px 20px; }
          .premium-reg-wrapper .grid-2, .premium-reg-wrapper .grid-3 { grid-template-columns: 1fr; }
          .premium-reg-wrapper .span-2, .premium-reg-wrapper .span-3 { grid-column: span 1; }
          .premium-reg-wrapper .plan-grid { grid-template-columns: 1fr; }
          .premium-reg-wrapper .sig-row { grid-template-columns: 1fr; }
          .premium-reg-wrapper .form-title { padding: 12px 20px; }
          .premium-reg-wrapper .form-footer { flex-direction: column; gap: 4px; text-align: center; padding: 14px 20px; }
        }
      `}} />
      <div className="premium-reg-wrapper">
        <div className="page">
          
          {/* HEADER */}
          <div className="header">
            <div className="logo-box" style={{ padding: '2px', background: 'var(--white)' }}>
              <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px' }} />
            </div>
            <div className="brand">
              <h1>MILESTONE <span>ENERGYM</span></h1>
              <p>नवलाराम की चक्की, Near Crown Plaza, NH68<br/>जैसलमेर रोड बाड़मेर, Barmer, Rajasthan – 344001</p>
            </div>
            <div className="header-meta">
              <div className="date">Date: {new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}</div>
              <div className="member-badge">📋 New Registration</div>
            </div>
          </div>

          {/* TITLE BAR */}
          <div className="form-title">
            <div className="bar"></div>
            <h2>Member Registration Form</h2>
          </div>

          {/* FORM BODY */}
          <div className="form-body">
            <form id="regForm" onSubmit={handleSubmit}>

              {/* PERSONAL INFORMATION */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Personal Information</span></div>
                <div className="grid-row grid-2">
                  <div className="field">
                    <label>Full Name <span className="req">*</span></label>
                    <input type="text" name="fullName" placeholder="e.g. Sanu Kumar" required />
                  </div>
                  <div className="field">
                    <label>Gender <span className="req">*</span></label>
                    <select name="gender" required>
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Date of Birth <span className="req">*</span></label>
                    <input type="date" name="dob" required />
                  </div>
                  <div className="field">
                    <label>Blood Group</label>
                    <select name="bloodGroup">
                      <option value="">Select Blood Group</option>
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                      <option>Unknown</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Phone Number <span className="req">*</span></label>
                    <input type="tel" name="phone" placeholder="9XXXXXXXXX" maxLength={10} required />
                  </div>
                  <div className="field">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="example@gmail.com" />
                  </div>
                  <div className="field span-2">
                    <label>Full Address <span className="req">*</span></label>
                    <textarea name="address" placeholder="Ward No., Village / Town, District, State – PIN Code" required></textarea>
                  </div>
                </div>
              </div>

              {/* EMERGENCY CONTACT */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Emergency Contact</span></div>
                <div className="grid-row grid-2">
                  <div className="field">
                    <label>Contact Person Name <span className="req">*</span></label>
                    <input type="text" name="emergName" placeholder="Full name of contact person" required />
                  </div>
                  <div className="field">
                    <label>Contact Phone</label>
                    <input type="tel" name="emergPhone" placeholder="Phone number" maxLength={10} />
                  </div>
                </div>
              </div>

              {/* MEMBERSHIP PLAN */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Membership Plan</span></div>
                
                {/* DB Plans as cards */}
                {dbPlans.length > 0 && (
                  <>
                    <div style={{fontSize:'11px', fontWeight:700, color:'#6B7A99', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'10px'}}>Standard Plans</div>
                    <div className="plan-grid" style={{marginBottom:'16px'}}>
                      {dbPlans.filter(p => p.isActive !== false).map((plan) => (
                        <label 
                          key={plan.id} 
                          className={`plan-card ${selectedPlanType === 'db' && selectedDbPlan?.id === plan.id ? 'selected' : ''}`}
                        >
                          <input 
                            type="radio" 
                            name="planSelection" 
                            value={plan.id}
                            checked={selectedPlanType === 'db' && selectedDbPlan?.id === plan.id}
                            onChange={() => {
                              setSelectedPlanType('db')
                              setSelectedDbPlan(plan)
                              setAmountPaid(String(plan.price))
                              setPdfAmount(String(plan.price))
                              setCustomMonths('')
                            }}
                          />
                          <div className="plan-name">{plan.name}</div>
                          <div className="plan-price">₹{plan.price?.toLocaleString('en-IN')} <span>/ {plan.durationInDays} days</span></div>
                          <div className="checkmark">✅</div>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {/* Custom 1–15 month option */}
                <div style={{fontSize:'11px', fontWeight:700, color:'#6B7A99', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:'10px', marginTop:'4px'}}>Custom Duration</div>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <label className={`plan-card ${selectedPlanType === 'custom' ? 'selected' : ''}`} style={{flex: 1, textAlign:'left', display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px'}}>
                    <input 
                      type="radio" 
                      name="planSelection" 
                      value="custom"
                      checked={selectedPlanType === 'custom'}
                      onChange={() => {
                        setSelectedPlanType('custom')
                        setSelectedDbPlan(null)
                        setAmountPaid('')
                        setPdfAmount('')
                      }}
                    />
                    <div>
                      <div className="plan-name" style={{margin:0, textAlign:'left'}}>Custom Duration</div>
                      <div style={{fontSize:'12px', color:'#6B7A99', marginTop:'2px'}}>1 – 15 Months</div>
                    </div>
                    <div className="checkmark" style={{position:'static', marginLeft:'auto'}}>✅</div>
                  </label>
                  {selectedPlanType === 'custom' && (
                    <div className="field" style={{marginBottom:0, minWidth:'160px'}}>
                      <select value={customMonths} onChange={e => setCustomMonths(e.target.value)} required={selectedPlanType === 'custom'}>
                        <option value="">Select months...</option>
                        {[...Array(15)].map((_, i) => (
                          <option key={i+1} value={String(i+1)}>{i+1} Month{i+1 > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* PAYMENT */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Payment Details</span></div>
                <div className="grid-row grid-2" style={{marginBottom: '18px'}}>
                  <div className="field">
                    <label>Start Date <span className="req">*</span></label>
                    <input type="date" name="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>End Date (Auto)</label>
                    <input type="date" name="endDate" value={endDate} readOnly style={{background: '#F0F4FF', color: '#4566B0', cursor: 'not-allowed'}} />
                  </div>
                  <div className="field">
                    <label>Actual Amount Paid (₹) <span className="req">*</span> <span style={{fontWeight:400,textTransform:'none',fontSize:'10px',color:'#6B7A99'}}>(for admin records)</span></label>
                    <input type="number" name="amountPaid" placeholder="e.g. 999" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
                    {isAdmin && (
                      <div style={{display:'flex', gap:'6px', marginTop:'8px', flexWrap:'wrap'}}>
                        {[10, 20, 25, 30].map(pct => (
                          <button 
                            key={pct}
                            type="button"
                            onClick={() => {
                              const basePrice = selectedDbPlan ? selectedDbPlan.price : 0
                              if (basePrice > 0) {
                                const discounted = Math.round(basePrice - (basePrice * (pct / 100)))
                                setAmountPaid(String(discounted))
                              } else if (amountPaid) {
                                const current = Number(amountPaid)
                                const discounted = Math.round(current - (current * (pct / 100)))
                                setAmountPaid(String(discounted))
                              }
                            }}
                            style={{
                              fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px',
                              background: '#E0E7F5', color: '#1A4BD4', border: '1px solid #C2D1F0', cursor: 'pointer'
                            }}
                          >
                            {pct}% OFF
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <label>PDF / Contract Amount (₹) <span style={{fontWeight:400,textTransform:'none',fontSize:'10px',color:'#6B7A99'}}>(shown on PDF)</span></label>
                    <input type="number" name="pdfAmount" placeholder="Leave blank to use actual" value={pdfAmount} onChange={(e) => setPdfAmount(e.target.value)} />
                  </div>
                </div>
                <div className="field" style={{marginBottom: 0}}>
                  <label>Payment Mode <span className="req">*</span></label>
                  <div className="payment-options" style={{marginTop: '4px'}}>
                    {[
                      { val: 'CASH', label: 'Cash', icon: '💵' },
                      { val: 'UPI', label: 'UPI / PhonePe', icon: '📱' },
                      { val: 'CARD', label: 'Card', icon: '💳' },
                      { val: 'BANK', label: 'Bank Transfer', icon: '🏦' }
                    ].map(mode => (
                      <label key={mode.val} className={`pay-opt ${payMode === mode.val ? 'selected' : ''}`}>
                        <input type="radio" name="payMode" value={mode.val} checked={payMode === mode.val} onChange={() => setPayMode(mode.val)} />
                        <span className="icon">{mode.icon}</span> {mode.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* HEALTH INFO */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Health Information</span></div>
                <div className="grid-row grid-2">
                  <div className="field span-2">
                    <label>Any Medical Condition / Injury? (If applicable)</label>
                    <textarea name="medical" placeholder="Mention any medical condition, injury, or physical limitation..."></textarea>
                  </div>
                </div>
              </div>

              {/* TERMS & CONDITIONS */}
              <div className="section">
                <div className="section-label"><div className="dot"></div><span>Terms &amp; Conditions</span></div>
                <div className="tc-box">
                  <h4>Please Read Carefully</h4>
                  <ol>
                    <li><strong>Non-Refundable Fees:</strong> All membership fees and personal training packages are strictly non-refundable and non-transferable under any circumstances.</li>
                    <li><strong>Health Declaration:</strong> The Member declares that they are physically sound and suffering from no condition, impairment, disease or infirmity that would prevent their participation in active or passive exercise.</li>
                    <li><strong>Gym Rules:</strong> Members must carry a towel, wear appropriate gym attire and indoor sports shoes. Dropping weights heavily or aggressive behavior is strictly prohibited.</li>
                    <li><strong>Liability:</strong> Milestone Energym and its management shall not be liable for any loss of personal property or any physical injury sustained within the premises.</li>
                    <li><strong>Right of Admission:</strong> The management reserves the right of admission and the right to cancel any membership without refund if rules are violated.</li>
                  </ol>
                </div>
                <label className="agree-row">
                  <input type="checkbox" name="agree" required />
                  <p><em>"I have read, understood, and agreed to abide by all the terms and conditions outlined above and displayed at the gym premises."</em></p>
                </label>
              </div>

              {/* SIGNATURE */}
              <div className="section" style={{marginBottom: '28px'}}>
                <div className="section-label"><div className="dot"></div><span>Signature</span></div>
                <div className="sig-row">
                  <div className="sig-block">
                    <label>Member's Signature</label>
                    <div className="sig-canvas-wrap">
                      <span className="sig-hint">Sign here (print name below)</span>
                    </div>
                    <div style={{marginTop: '8px'}}>
                      <input type="text" name="sigName" placeholder="Print full name" style={{border:'none', borderBottom:'1.5px solid var(--border)', borderRadius:0, background:'transparent', padding:'6px 0', fontStyle:'italic', fontSize:'15px', fontWeight:600, width:'100%', color: 'var(--text)', outline: 'none'}} />
                    </div>
                  </div>
                  <div className="sig-block">
                    <label>Authorized Signatory — Milestone Energym</label>
                    <div className="sig-canvas-wrap" style={{cursor: 'default'}}>
                      <div style={{fontSize: '28px', fontWeight: 800, fontStyle: 'italic', color: 'var(--navy)', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-1px', opacity: 0.7}}>JASRAJ</div>
                    </div>
                    <div style={{marginTop: '8px'}}>
                      <div className="sig-name-line">Authorized Signatory</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="submit-row">
                <button type="reset" className="btn-reset">Reset Form</button>
                <button type="submit" disabled={isSubmitting} className="btn-submit">
                  {isSubmitting ? 'Submitting...' : '✅ Submit Registration'}
                </button>
              </div>

            </form>
          </div>

          {/* FOOTER */}
          <div className="form-footer">
            <p>© {new Date().getFullYear()} Milestone Energym, Barmer, Rajasthan – 344001</p>
            <div className="contact">📞 +91 8875305442 &nbsp;|&nbsp; ✉ Milestonenergym@gmail.com</div>
          </div>
        </div>
      </div>
      
      {/* SUCCESS OVERLAY */}
      <div className={`success-overlay ${showSuccess ? 'show' : ''}`}>
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h3>Registration Successful!</h3>
          <p>Welcome to <strong>Milestone Energym</strong>! Your membership has been registered.</p>
          <div style={{marginBottom: '24px'}} />
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Close</button>
        </div>
      </div>
    </>
  )
}
