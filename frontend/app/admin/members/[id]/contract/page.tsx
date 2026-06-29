import { getMemberById, getMemberSequentialId } from '@/app/actions/members'
import { getGymSettings } from '@/app/actions/settings'
import { notFound } from 'next/navigation'
import DownloadPdfButton from '@/components/DownloadPdfButton'

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

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: '2rem 0' }}>
      <div 
        id="contract-content" 
        className="max-w-4xl mx-auto p-8 md:p-12 relative overflow-hidden"
        style={{ 
          backgroundColor: '#ffffff',
          color: '#111827',
          fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
          minHeight: '1056px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        
        {/* Top Gold Accent Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', backgroundColor: '#D4AF37' }}></div>

        {/* Header Section */}
        <div className="flex justify-between items-start pb-6 mb-8" style={{ borderBottom: '3px solid #0F52BA' }}>
          <div className="flex items-center gap-5">
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt="Gym Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', mixBlendMode: 'screen' }} />
            )}
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight mb-1" style={{ color: '#0F52BA' }}>
                {settings?.gymName || 'Milestone Energym'}
              </h1>
              <p className="text-sm font-medium leading-snug mb-1" style={{ color: '#4B5563', maxWidth: '300px' }}>
                {settings?.address || '123 Fitness Street, Gym City, 10001'}
              </p>
              <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                {settings?.contactPhone} | {settings?.contactEmail}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div style={{ backgroundColor: '#0F52BA', color: '#ffffff', padding: '8px 16px', borderRadius: '4px', display: 'inline-block', marginBottom: '12px' }}>
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Membership Form
              </h2>
            </div>
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>
              Date: <span style={{ color: '#111827' }}>{new Date().toLocaleDateString('en-IN')}</span>
            </p>
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>
              Member ID: <span style={{ color: '#111827' }}>{sequentialId}</span>
            </p>
          </div>
        </div>

        {/* Member Details */}
        <div className="mb-8">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="text-lg font-bold uppercase" style={{ color: '#0F52BA', marginRight: '12px' }}>Member Information</h3>
            <div style={{ flexGrow: 1, height: '2px', backgroundColor: '#E5E7EB' }}></div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-12 px-2">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Full Name</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{member.name}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Phone Number</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Email Address</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{member.email}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Gender</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.gender || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Address</span>
              <p className="font-bold text-lg pb-1 min-h-[32px]" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.address || ' '}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Emergency Contact Name</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.emergencyContact || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Emergency Contact Phone</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.emergencyContactPhone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Blood Group</span>
              <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{profile.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Membership Plan Details */}
        <div className="mb-10">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="text-lg font-bold uppercase" style={{ color: '#0F52BA', marginRight: '12px' }}>Membership Details</h3>
            <div style={{ flexGrow: 1, height: '2px', backgroundColor: '#E5E7EB' }}></div>
          </div>

          {plan ? (
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 px-2">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Plan Name</span>
                <p className="font-black text-xl pb-1" style={{ color: '#D4AF37', borderBottom: '1px solid #D1D5DB' }}>{plan.name}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Amount Paid</span>
                <p className="font-black text-xl pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>
                  ₹{activeMembership.pdfAmount ?? activeMembership.amountPaid}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Payment Mode</span>
                <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>{activeMembership.paymentMode}</p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Start Date</span>
                <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>
                  {new Date(activeMembership.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>End Date</span>
                <p className="font-bold text-lg pb-1" style={{ color: '#111827', borderBottom: '1px solid #D1D5DB' }}>
                  {new Date(activeMembership.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-2">
              <p style={{ fontStyle: 'italic', color: '#6B7280', marginBottom: '8px' }}>No active membership plan recorded yet.</p>
              {profile.requestedDuration && (
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider" style={{ color: '#6B7280' }}>Requested Duration</span>
                  <p className="font-black text-lg pb-1" style={{ color: '#D4AF37', borderBottom: '1px solid #D1D5DB' }}>{profile.requestedDuration}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-12">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="text-lg font-bold uppercase" style={{ color: '#0F52BA', marginRight: '12px' }}>Terms & Conditions</h3>
            <div style={{ flexGrow: 1, height: '2px', backgroundColor: '#E5E7EB' }}></div>
          </div>
          
          <div className="px-2 text-sm space-y-3" style={{ color: '#374151', lineHeight: '1.6' }}>
            <p><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>1.</span> <strong style={{ color: '#111827' }}>Non-Refundable Fees:</strong> All membership fees and personal training packages are strictly non-refundable and non-transferable under any circumstances.</p>
            <p><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>2.</span> <strong style={{ color: '#111827' }}>Health Declaration:</strong> The Member declares that they are physically sound and suffering from no condition, impairment, disease or infirmity that would prevent their participation in active or passive exercise.</p>
            <p><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>3.</span> <strong style={{ color: '#111827' }}>Gym Rules:</strong> Members must carry a towel, wear appropriate gym attire and indoor sports shoes. Dropping weights heavily or aggressive behavior is strictly prohibited.</p>
            <p><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>4.</span> <strong style={{ color: '#111827' }}>Liability:</strong> Milestone Energym and its management shall not be liable for any loss of personal property or any physical injury sustained within the premises.</p>
            <p><span style={{ color: '#D4AF37', fontWeight: 'bold' }}>5.</span> <strong style={{ color: '#111827' }}>Right of Admission:</strong> The management reserves the right of admission and the right to cancel any membership without refund if rules are violated.</p>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F9FAFB', borderLeft: '4px solid #0F52BA', borderRadius: '0 4px 4px 0' }}>
              <p style={{ fontWeight: '600', fontStyle: 'italic', color: '#111827', margin: 0 }}>"I have read, understood, and agreed to abide by all the terms and conditions outlined above and displayed at the gym premises."</p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-20 px-8 pt-4">
          <div className="w-1/3 text-center">
            <div style={{ borderBottom: '2px solid #111827', width: '100%', marginBottom: '8px', height: '40px' }}></div>
            <p className="font-bold uppercase text-xs tracking-wider" style={{ color: '#4B5563' }}>Member's Signature</p>
          </div>
          
          <div className="w-1/3 text-center relative">
            <div className="absolute -top-14 left-0 w-full text-center">
              <span className="text-5xl opacity-90" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#0F52BA" }}>
                JASRAJ
              </span>
            </div>
            <div style={{ borderBottom: '2px solid #111827', width: '100%', marginBottom: '8px' }}></div>
            <p className="font-bold uppercase text-xs tracking-wider" style={{ color: '#4B5563' }}>Authorized Signatory</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: '#D4AF37' }}>Milestone Energym</p>
          </div>
        </div>

        {/* Download Button - Handles actual PDF generation via html2pdf */}
        <DownloadPdfButton 
          memberName={member.name || 'Member'} 
          sequentialId={sequentialId} 
          autoDownload={resolvedSearchParams?.download === 'true'}
        />

      </div>
    </div>
  )
}
