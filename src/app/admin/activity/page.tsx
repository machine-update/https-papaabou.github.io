import { ActivityAdminClient } from './activity-admin-client'

export default function AdminActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Activite</p>
        <h1 className="mt-2 text-3xl font-semibold">Journal d activite</h1>
      </div>
      <ActivityAdminClient />
    </div>
  )
}
