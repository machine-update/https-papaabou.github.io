import { ProductionsAdminClient } from './productions-admin-client'

export default function AdminProductionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Productions</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des productions</h1>
      </div>
      <ProductionsAdminClient />
    </div>
  )
}
