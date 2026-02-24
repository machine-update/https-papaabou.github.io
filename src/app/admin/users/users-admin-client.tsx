'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/confirm-dialog'

type AdminUser = {
  id: string
  email: string
  role: 'ADMIN' | 'EDITOR'
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type UserForm = {
  email: string
  password: string
  role: 'ADMIN' | 'EDITOR'
}

const emptyForm: UserForm = {
  email: '',
  password: '',
  role: 'EDITOR',
}

export function UsersAdminClient() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 1 })
  const [q, setQ] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; email: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier utilisateur' : 'Ajouter utilisateur'), [editingId])

  async function loadUsers(nextPage = meta.page) {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(meta.pageSize),
      })
      if (q.trim()) params.set('q', q.trim())

      if (roleFilter !== 'all') params.set('role', roleFilter)

      const res = await fetch(`/api/users?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les utilisateurs')
      const payload = await res.json()
      setUsers(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger les utilisateurs (verifie migration DB / connexion PostgreSQL)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, roleFilter])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const isEditing = Boolean(editingId)
    const endpoint = isEditing ? `/api/users/${editingId}` : '/api/users'

    const response = await fetch(endpoint, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Action impossible' }))
      setError(payload.error || 'Action impossible')
      return
    }

    resetForm()
    await loadUsers(meta.page)
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const response = await fetch(`/api/users/${deleteTarget.id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      setIsDeleting(false)
      return
    }

    setDeleteTarget(null)
    setIsDeleting(false)
    await loadUsers(meta.page)
  }

  function onEdit(user: AdminUser) {
    setEditingId(user.id)
    setForm({
      email: user.email,
      role: user.role,
      password: '',
    })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="admin-input"
            required
          />
        </Field>

        <Field label={editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            className="admin-input"
            required={!editingId}
          />
        </Field>

        <Field label="Role">
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as 'ADMIN' | 'EDITOR' }))}
            className="admin-input"
          >
            <option value="EDITOR">EDITOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </Field>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" className="rounded-xl bg-[#f19b32] px-4 py-2 text-sm font-medium text-black">
            {editingId ? 'Enregistrer' : 'Ajouter'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-4 py-2 text-sm">
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche email..."
            className="admin-input"
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-input">
            <option value="all">Tous les roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EDITOR">EDITOR</option>
          </select>
        </div>

        {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

        <div className="space-y-3">
          {users.map((user) => (
            <article key={user.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="mt-1 text-xs text-white/50">Cree le {new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-[#f19b32]/35 px-3 py-1 text-xs text-[#f19b32]">{user.role}</span>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: user.id, email: user.email })}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </article>
          ))}

          {!loading && users.length === 0 ? <p className="text-sm text-white/60">Aucun utilisateur.</p> : null}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPrev={() => void loadUsers(Math.max(1, meta.page - 1))}
          onNext={() => void loadUsers(Math.min(meta.totalPages, meta.page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmer la suppression de cet utilisateur ?"
        message={deleteTarget ? `Utilisateur: ${deleteTarget.email}` : undefined}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void onConfirmDelete()}
      />
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
}: {
  page: number
  totalPages: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm">
      <p className="text-white/65">
        Page {page}/{Math.max(totalPages, 1)} • {total} elements
      </p>
      <div className="flex gap-2">
        <button type="button" onClick={onPrev} disabled={page <= 1} className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-40">
          Precedent
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/55">{label}</span>
      {children}
    </label>
  )
}
