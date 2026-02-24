import { UsersAdminClient } from './users-admin-client'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Admin / Utilisateurs</p>
        <h1 className="mt-2 text-3xl font-semibold">Gestion des utilisateurs</h1>
      </div>
      <UsersAdminClient />
    </div>
  )
}
