import { getRegistrationLink } from '@/app/actions/registration-links'
import { Dumbbell, XCircle, Clock } from 'lucide-react'
import PremiumRegistrationForm from '@/components/PremiumRegistrationForm'

export default async function RegisterPage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params
  const token = resolvedParams.token
  
  const link = await getRegistrationLink(token)
  
  if (!link) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Invalid Link</h1>
        <p className="text-zinc-400 text-center">This registration link is invalid or does not exist.</p>
      </div>
    )
  }

  if (link.isUsed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
          <Dumbbell className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">You are already Registered</h1>
        <p className="text-zinc-400 text-center">Your details have been successfully submitted to the admin.</p>
      </div>
    )
  }

  if (new Date() > new Date(link.expiresAt)) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <Clock className="w-16 h-16 text-orange-500 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Link Expired</h1>
        <p className="text-zinc-400 text-center">This registration link has expired (valid for 30 minutes only). Please ask the admin for a new link.</p>
      </div>
    )
  }

  return <PremiumRegistrationForm token={token} />
}
