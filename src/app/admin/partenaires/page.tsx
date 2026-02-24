import { PartenairesAdminClient } from './partenaires-admin-client'

export default function AdminPartenairesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Partenaires</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des partenaires</h1>
      </div>
      <PartenairesAdminClient />
    </div>
  )
}
