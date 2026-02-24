import { ProjectsAdminClient } from './projects-admin-client'

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Projets</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des projets</h1>
      </div>
      <ProjectsAdminClient />
    </div>
  )
}
