import PremiumRegistrationForm from '@/components/PremiumRegistrationForm'
import { getPlans } from '@/app/actions/plans'

export default async function NewMemberPage() {
  const plans = await getPlans()
  return <PremiumRegistrationForm isAdmin={true} dbPlans={plans} />
}
