import { ServicesAdminClient } from './services-admin-client'

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Services</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des services</h1>
      </div>
      <ServicesAdminClient />
    </div>
  )
}
