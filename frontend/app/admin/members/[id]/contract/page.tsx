import { getMemberById, getMemberSequentialId } from '@/app/actions/members'
import { getGymSettings } from '@/app/actions/settings'
import { notFound } from 'next/navigation'
import PrintTrigger from '@/components/PrintTrigger'

export default async function MemberContractPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const [member, settings] = await Promise.all([
    getMemberById(resolvedParams.id),
    getGymSettings()
  ])
  
  if (!member) {
    notFound()
  }

  const sequentialId = await getMemberSequentialId(member.createdAt)

  const profile: any = member.profile || {}
  const activeMembership = member.memberships?.[0]
  const plan = activeMembership?.plan

  const fmt = (d: Date | undefined | null) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})
  }

  const autoPrint = resolvedSearchParams?.print === 'true'
  const autoDownload = resolvedSearchParams?.download === 'true'
  const filename = `Milestone_Contract_${sequentialId}_${(member.name || 'Member').replace(/\s+/g, '_')}`

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet" />

      {/* Auto-trigger: print or download on load */}
      <PrintTrigger 
        autoPrint={autoPrint} 
        autoDownload={autoDownload}
        filename={filename}
        sequentialId={sequentialId}
        memberName={member.name || 'Member'}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          --navy:  #0B1F4B;
          --blue:  #1A4BD4;
          --gold:  #E6A817;
          --white: #FFFFFF;
          --off:   #F4F6FB;
          --border:#D0D9ED;
          --text:  #1C2640;
          --muted: #6B7A99;
          font-family: 'Barlow', Arial, sans-serif;
          background: #e8ecf4;
          color: #1C2640;
        }

        .page-wrap {
          padding: 24px 16px 48px;
          min-height: 100vh;
        }

        /* Print button bar — hidden when printing */
        .print-bar {
          max-width: 794px;
          margin: 0 auto 16px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .print-bar button {
          padding: 10px 28px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .print-bar button:hover { opacity: 0.85; }
        .btn-print { background: #1C2640; color: #fff; }
        .btn-download { background: #E6A817; color: #1C2640; }

        /* ═══════════════════════════════════════════
           A4 PAGE WRAPPER
        ═══════════════════════════════════════════ */
        .a4-page {
          width: 794px;
          min-height: 1123px;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0 8px 40px rgba(0,0,0,.18);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        /* ── TOP ACCENT BAR ── */
        .accent-bar {
          height: 6px;
          background: linear-gradient(90deg, #E6A817 0%, #F5C842 40%, #1A4BD4 100%);
        }

        /* ── HEADER ── */
        .header {
          background: #0B1F4B;
          padding: 22px 40px 18px;
          display: flex;
          align-items: flex-start;
          gap: 18px;
        }
        .logo-box {
          width: 64px; height: 64px;
          background: #E6A817;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 18px;
          color: #0B1F4B;
          flex-shrink: 0;
          letter-spacing: -1px;
          overflow: hidden;
        }
        .brand { flex: 1; }
        .brand h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 26px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          line-height: 1;
          margin: 0;
        }
        .brand h1 span { color: #E6A817; }
        .brand .addr {
          font-size: 10.5px;
          color: rgba(255,255,255,.55);
          margin-top: 5px;
          line-height: 1.55;
        }
        .header-right { text-align: right; flex-shrink: 0; }
        .header-right .doc-title {
          font-size: 11px;
          font-weight: 700;
          color: #E6A817;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }
        .date-badge {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 6px;
          padding: 5px 12px;
          display: inline-block;
        }
        .date-badge .lbl { font-size: 9px; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .8px; }
        .date-badge .val { font-size: 13px; font-weight: 700; color: #fff; }
        .member-id-box { margin-top: 8px; }
        .member-id-box .lbl { font-size: 9px; color: rgba(255,255,255,.5); text-transform: uppercase; letter-spacing: .8px; }
        .member-id-box .val { font-size: 12px; font-weight: 800; color: #E6A817; letter-spacing: .5px; }

        /* ── GOLD DIVIDER ── */
        .gold-bar {
          height: 3px;
          background: linear-gradient(90deg, #E6A817 0%, transparent 80%);
        }

        /* ── BODY ── */
        .body { padding: 24px 40px 30px; }

        /* ── SECTION HEADING ── */
        .sec-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 18px 0 12px;
        }
        .sec-head .bar { width: 4px; height: 16px; background: #E6A817; border-radius: 2px; flex-shrink: 0; }
        .sec-head span {
          font-size: 10px;
          font-weight: 800;
          color: #1A4BD4;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .sec-head::after { content: ''; flex: 1; height: 1px; background: #D0D9ED; }

        /* ── INFO GRID ── */
        .info-grid { display: flex; flex-direction: column; }
        .info-row {
          display: flex;
          border-bottom: 1px solid #D0D9ED;
        }
        .info-row .info-cell { flex: 1; }
        .info-row:last-child { border-bottom: none; }

        .info-cell {
          padding: 9px 14px;
          border-right: 1px solid #D0D9ED;
          min-height: 46px;
        }
        .info-cell:last-child { border-right: none; }
        .info-cell .lbl {
          font-size: 8.5px;
          font-weight: 700;
          color: #6B7A99;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 3px;
        }
        .info-cell .val {
          font-size: 13px;
          font-weight: 700;
          color: #1C2640;
          line-height: 1.3;
        }
        .info-cell .val.gold { color: #E6A817; font-size: 15px; }
        .info-cell .val.blue { color: #1A4BD4; }
        .info-cell .val.big  { font-size: 16px; font-weight: 800; }

        .info-grid-wrapper {
          border: 1.5px solid #D0D9ED;
          border-radius: 8px;
          overflow: hidden;
        }

        /* ── MEMBERSHIP PLAN BOX ── */
        .plan-box {
          background: linear-gradient(135deg, #0B1F4B 0%, #0F2860 100%);
          border-radius: 8px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .plan-box .plan-name { font-size: 11px; font-weight: 700; color: rgba(255,255,255,.6); text-transform: uppercase; letter-spacing: 1.5px; }
        .plan-box .plan-val  { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 800; color: #E6A817; line-height: 1; }
        .plan-box .plan-sep  { width: 1px; height: 36px; background: rgba(255,255,255,.15); }
        .plan-box .plan-period { font-size: 11px; color: rgba(255,255,255,.5); text-align: center; }
        .plan-box .plan-period .pv { font-size: 14px; font-weight: 700; color: #fff; display: block; margin-top: 2px; }

        /* ── TERMS ── */
        .terms-box {
          background: #F4F6FB;
          border: 1px solid #D0D9ED;
          border-left: 4px solid #E6A817;
          border-radius: 6px;
          padding: 14px 18px;
          margin-bottom: 4px;
        }
        .terms-box .t-head {
          font-size: 9px;
          font-weight: 800;
          color: #0B1F4B;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }
        .terms-box ol { padding-left: 16px; margin: 0; }
        .terms-box li {
          font-size: 10px;
          color: #4A5568;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .terms-box li strong { color: #1C2640; }

        /* ── DECLARATION ── */
        .declaration {
          border: 1px solid #E6A817;
          border-radius: 6px;
          padding: 12px 16px;
          font-size: 10.5px;
          color: #0B1F4B;
          font-style: italic;
          font-weight: 600;
          line-height: 1.6;
          text-align: center;
          background: #FFFBF0;
          margin-bottom: 14px;
        }

        /* ── SIGNATURE AREA ── */
        .sig-area {
          display: flex;
          gap: 32px;
          margin-top: 10px;
        }
        .sig-block { flex: 1; }
        .sig-block .sig-lbl {
          font-size: 8.5px;
          font-weight: 700;
          color: #6B7A99;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .sig-block .sig-box {
          height: 60px;
          border: 1.5px dashed #D0D9ED;
          border-radius: 6px;
          background: #F4F6FB;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sig-block .sig-box .sig-script {
          font-size: 26px;
          font-weight: 800;
          font-style: italic;
          color: #0B1F4B;
          font-family: 'Barlow Condensed', sans-serif;
          letter-spacing: -1px;
          opacity: .75;
        }
        .sig-block .sig-name-line {
          border-top: 1.5px solid #D0D9ED;
          margin-top: 8px;
          padding-top: 5px;
          font-size: 10px;
          color: #6B7A99;
          text-transform: uppercase;
          letter-spacing: .8px;
        }
        .sig-block .sig-name-line .name-val {
          font-size: 12px;
          font-weight: 700;
          color: #1C2640;
          text-transform: none;
          letter-spacing: 0;
          display: block;
          margin-top: 2px;
        }

        /* ── FOOTER ── */
        .footer {
          background: #0B1F4B;
          padding: 12px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer p { font-size: 9.5px; color: rgba(255,255,255,.4); margin: 0; }
        .footer .contact { font-size: 9.5px; color: #E6A817; font-weight: 600; }

        /* ── PRINT STYLES ── */
        @media print {
          body { background: #fff !important; }
          .page-wrap { padding: 0 !important; background: #fff !important; }
          .print-bar { display: none !important; }
          .a4-page {
            width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
          }
        }
      `}} />

      <div className="page-wrap">
        {/* PRINT BAR */}
        <div className="print-bar">
          <button className="btn-print" onClick={() => window.print()}>🖨 Print</button>
          <button className="btn-download" id="download-btn">⬇ Download PDF</button>
        </div>

        {/* A4 PAGE */}
        <div className="a4-page" id="contract-content">
          <div className="accent-bar"></div>

          {/* HEADER */}
          <div className="header">
            <div className="logo-box" style={{ width: '64px', height: '64px', overflow: 'hidden' }}>
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '10px' }} />
              ) : 'ME'}
            </div>
            <div className="brand">
              <h1>{settings?.gymName || 'MILESTONE'} <span>{settings?.gymName ? '' : 'ENERGYM'}</span></h1>
              <div className="addr">
                {settings?.address || 'नवलाराम की चक्की, Near Crown Plaza, NH68 जैसलमेर रोड बाड़मेर'}<br/>
                {settings?.contactPhone ? `+91 ${settings.contactPhone}` : '+91 8875305442'} &nbsp;|&nbsp; {settings?.contactEmail || 'Milestonenergym@gmail.com'}
              </div>
            </div>
            <div className="header-right">
              <div className="doc-title">Member Registration Contract</div>
              <div className="date-badge">
                <div className="lbl">Date</div>
                <div className="val">{fmt(new Date())}</div>
              </div>
              <div className="member-id-box">
                <div className="lbl">Member ID</div>
                <div className="val">{sequentialId}</div>
              </div>
            </div>
          </div>
          <div className="gold-bar"></div>

          {/* BODY */}
          <div className="body">

            {/* MEMBER INFORMATION */}
            <div className="sec-head"><div className="bar"></div><span>Member Information</span></div>
            <div className="info-grid-wrapper">
              <div className="info-grid">
                <div className="info-row">
                  <div className="info-cell">
                    <div className="lbl">Full Name</div>
                    <div className="val big">{member.name}</div>
                  </div>
                  <div className="info-cell">
                    <div className="lbl">Phone Number</div>
                    <div className="val big">{profile.phone || 'N/A'}</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-cell">
                    <div className="lbl">Email Address</div>
                    <div className="val">{member.email || 'N/A'}</div>
                  </div>
                  <div className="info-cell">
                    <div className="lbl">Gender</div>
                    <div className="val">{profile.gender || 'N/A'}</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-cell">
                    <div className="lbl">Address</div>
                    <div className="val">{profile.address || 'N/A'}</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-cell">
                    <div className="lbl">Emergency Contact Name</div>
                    <div className="val">{profile.emergencyContact || 'N/A'}</div>
                  </div>
                  <div className="info-cell">
                    <div className="lbl">Emergency Contact Phone</div>
                    <div className="val">{profile.emergencyContactPhone || 'N/A'}</div>
                  </div>
                  <div className="info-cell">
                    <div className="lbl">Blood Group</div>
                    <div className="val blue">{profile.bloodGroup || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MEMBERSHIP DETAILS */}
            <div className="sec-head"><div className="bar"></div><span>Membership Details</span></div>
            {plan ? (
              <div className="plan-box">
                <div>
                  <div className="plan-name">Plan Name</div>
                  <div className="plan-val">{plan.name}</div>
                </div>
                <div className="plan-sep"></div>
                <div style={{textAlign: 'center'}}>
                  <div className="plan-period">Amount Paid<span className="pv">₹{activeMembership?.pdfAmount ?? activeMembership?.amountPaid ?? 0}</span></div>
                </div>
                <div className="plan-sep"></div>
                <div style={{textAlign: 'center'}}>
                  <div className="plan-period">Payment Mode<span className="pv">{activeMembership?.paymentMode || 'CASH'}</span></div>
                </div>
                <div className="plan-sep"></div>
                <div style={{textAlign: 'center'}}>
                  <div className="plan-period">Start Date<span className="pv">{fmt(activeMembership?.startDate)}</span></div>
                </div>
                <div className="plan-sep"></div>
                <div style={{textAlign: 'center'}}>
                  <div className="plan-period">End Date<span className="pv">{fmt(activeMembership?.endDate)}</span></div>
                </div>
              </div>
            ) : (
              <div className="plan-box">
                <div>
                  <div className="plan-name">No active plan</div>
                  <div className="plan-val" style={{ fontSize: '18px' }}>Not Assigned</div>
                </div>
              </div>
            )}

            {/* TERMS & CONDITIONS */}
            <div className="sec-head" style={{marginTop: '18px'}}><div className="bar"></div><span>Terms &amp; Conditions</span></div>
            <div className="terms-box">
              <div className="t-head">Please Read Carefully Before Signing</div>
              <ol>
                <li><strong>Non-Refundable Fees:</strong> All membership fees and personal training packages are strictly non-refundable and non-transferable under any circumstances.</li>
                <li><strong>Health Declaration:</strong> The Member declares that they are physically sound and suffering from no condition, impairment, disease or infirmity that would prevent their participation in active or passive exercise.</li>
                <li><strong>Gym Rules:</strong> Members must carry a towel, wear appropriate gym attire and indoor sports shoes. Dropping weights heavily or aggressive behavior is strictly prohibited.</li>
                <li><strong>Liability:</strong> Milestone Energym and its management shall not be liable for any loss of personal property or any physical injury sustained within the premises.</li>
                <li><strong>Right of Admission:</strong> The management reserves the right of admission and the right to cancel any membership without refund if rules are violated.</li>
              </ol>
            </div>

            {/* DECLARATION */}
            <div className="declaration">
              &quot;I have read, understood, and agreed to abide by all the terms and conditions outlined above and displayed at the gym premises.&quot;
            </div>

            {/* SIGNATURE */}
            <div className="sig-area">
              <div className="sig-block">
                <div className="sig-lbl">Member&apos;s Signature</div>
                <div className="sig-box">
                  <span style={{color: '#C0CAE0', fontSize: '10px', fontStyle: 'italic'}}>Sign here</span>
                </div>
                <div className="sig-name-line">
                  Member Name
                  <span className="name-val">{member.name}</span>
                </div>
              </div>
              <div className="sig-block">
                <div className="sig-lbl">Authorized Signatory — Milestone Energym</div>
                <div className="sig-box">
                  <span className="sig-script">JASRAJ</span>
                </div>
                <div className="sig-name-line">
                  Authorized Signatory
                  <span className="name-val">{settings?.gymName || 'Milestone Energym'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <div className="footer">
            <p>© {new Date().getFullYear()} {settings?.gymName || 'Milestone Energym'} — {settings?.address || 'Barmer, Rajasthan – 344001'}</p>
            <div className="contact">📞 {settings?.contactPhone ? `+91 ${settings.contactPhone}` : '+91 8875305442'} &nbsp;|&nbsp; ✉ {settings?.contactEmail || 'Milestonenergym@gmail.com'}</div>
          </div>

        </div>
      </div>
    </>
  )
}
