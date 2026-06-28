import { getMemberById } from '@/app/actions/members'
import { getGymSettings } from '@/app/actions/settings'
import { notFound } from 'next/navigation'

// Optional: You can load a cursive font for the signature from Google Fonts
// like 'Great Vibes' or 'Dancing Script'. We'll use inline styles for it.

export default async function MemberContractPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const [member, settings] = await Promise.all([
    getMemberById(resolvedParams.id),
    getGymSettings()
  ])
  
  if (!member) {
    notFound()
  }

  const profile: any = member.profile || {}
  const activeMembership = member.memberships?.[0]
  const plan = activeMembership?.plan

  return (
    <div className="bg-white text-black min-h-screen font-serif print:bg-white print:m-0 print:p-0">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 print:shadow-none print:max-w-none print:w-full print:p-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
          <div className="flex items-center gap-4">
            {settings?.logoUrl && (
              <img src={settings.logoUrl} alt="Gym Logo" className="w-16 h-16 object-contain mix-blend-multiply" />
            )}
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-wider mb-1">{settings?.gymName || 'Milestone Energym'}</h1>
              <p className="text-sm text-gray-700 max-w-sm leading-snug mb-1">{settings?.address || '123 Fitness Street, Gym City, 10001'}</p>
              <p className="text-sm text-gray-700">Phone: {settings?.contactPhone} | Email: {settings?.contactEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest border-2 border-gray-800 px-4 py-2 inline-block">
              Membership Form
            </h2>
            <p className="text-sm mt-2 text-gray-600">
              Date: {new Date().toLocaleDateString('en-IN')}
            </p>
            <p className="text-sm text-gray-600">
              Member ID: {member.id.substring(member.id.length - 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Member Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase">Member Information</h3>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-3">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Full Name</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{member.name}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Phone Number</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{profile.phone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Email Address</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{member.email}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Gender</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{profile.gender || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-gray-500 uppercase font-semibold">Address</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1 min-h-[32px]">{profile.address || ' '}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Emergency Contact Name</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{profile.emergencyContact || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Emergency Contact Phone</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{profile.emergencyContactPhone || 'N/A'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Blood Group</span>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">{profile.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Membership Plan Details */}
        <div className="mb-8">
          <h3 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase">Membership Details</h3>
          {plan ? (
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 px-3">
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Plan Name</span>
                <p className="font-bold text-lg border-b border-gray-300 pb-1">{plan.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Amount Paid</span>
                <p className="font-bold text-lg border-b border-gray-300 pb-1">₹{activeMembership.amountPaid}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Start Date</span>
                <p className="font-medium text-lg border-b border-gray-300 pb-1">
                  {new Date(activeMembership.startDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">End Date</span>
                <p className="font-medium text-lg border-b border-gray-300 pb-1">
                  {new Date(activeMembership.endDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          ) : (
            <div className="px-3">
              <p className="italic text-gray-500 mb-2">No active membership plan recorded yet.</p>
              {profile.requestedDuration && (
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Requested Duration</span>
                  <p className="font-bold text-lg border-b border-gray-300 pb-1">{profile.requestedDuration}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="mb-12">
          <h3 className="text-lg font-bold bg-gray-100 px-3 py-1 mb-4 uppercase">Terms and Conditions</h3>
          <div className="px-3 text-sm text-gray-800 space-y-2">
            <p>1. <strong>Non-Refundable Fees:</strong> All membership fees and personal training packages are strictly non-refundable and non-transferable under any circumstances.</p>
            <p>2. <strong>Health Declaration:</strong> The Member declares that they are physically sound and suffering from no condition, impairment, disease or infirmity that would prevent their participation in active or passive exercise.</p>
            <p>3. <strong>Gym Rules:</strong> Members must carry a towel, wear appropriate gym attire and indoor sports shoes. Dropping weights heavily or aggressive behavior is strictly prohibited.</p>
            <p>4. <strong>Liability:</strong> Milestone Energym and its management shall not be liable for any loss of personal property or any physical injury sustained within the premises.</p>
            <p>5. <strong>Right of Admission:</strong> The management reserves the right of admission and the right to cancel any membership without refund if rules are violated.</p>
            <p className="pt-2 font-semibold italic">I have read, understood, and agreed to abide by all the terms and conditions outlined above and displayed at the gym premises.</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-16 px-4 pt-10 border-t border-gray-200">
          <div className="w-1/3 text-center">
            <div className="border-b-2 border-black w-full mb-2 h-8"></div>
            <p className="font-semibold uppercase text-sm">Member's Signature</p>
          </div>
          
          <div className="w-1/3 text-center relative">
            <div className="absolute -top-12 left-0 w-full text-center">
              <span className="text-5xl opacity-80" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", color: "#1a365d" }}>
                JASRAJ
              </span>
            </div>
            <div className="border-b-2 border-black w-full mb-2"></div>
            <p className="font-semibold uppercase text-sm">Authorized Signatory</p>
            <p className="text-xs text-gray-500">Milestone Energym</p>
          </div>
        </div>

        {/* Print Button - Hidden when printing */}
        <div className="mt-12 text-center print:hidden">
          <button 
            className="bg-black text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Click Ctrl+P (or Cmd+P) to Print / Save PDF
          </button>
        </div>

      </div>
    </div>
  )
}
