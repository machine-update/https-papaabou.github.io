import { ArtistesAdminClient } from './artistes-admin-client'

export default function AdminArtistesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Artistes</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des artistes</h1>
      </div>
      <ArtistesAdminClient />
    </div>
  )
}
