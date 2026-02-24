'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/confirm-dialog'

type Prestation = {
  id: string
  title: string
  description: string
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type PrestationPayload = Omit<Prestation, 'id' | 'createdAt'>

const emptyForm: PrestationPayload = {
  title: '',
  description: '',
}

export function PrestationsAdminClient() {
  const [prestations, setPrestations] = useState<Prestation[]>([])
  const [form, setForm] = useState<PrestationPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 1 })
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier la prestation' : 'Nouvelle prestation'), [editingId])

  async function loadPrestations(nextPage = meta.page) {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(meta.pageSize),
      })
      if (q.trim()) params.set('q', q.trim())

      const res = await fetch(`/api/prestations?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les prestations')
      const payload = await res.json()
      setPrestations(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger les prestations (verifie migration DB / connexion PostgreSQL)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPrestations(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const isEditing = Boolean(editingId)
    const endpoint = isEditing ? `/api/prestations/${editingId}` : '/api/prestations'

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
    await loadPrestations(meta.page)
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const response = await fetch(`/api/prestations/${deleteTarget.id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      setIsDeleting(false)
      return
    }

    setDeleteTarget(null)
    setIsDeleting(false)
    await loadPrestations(meta.page)
  }

  function onEdit(prestation: Prestation) {
    setEditingId(prestation.id)
    setForm({
      title: prestation.title,
      description: prestation.description,
    })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Field label="Titre">
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="admin-input"
            required
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="admin-input min-h-28"
            required
          />
        </Field>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" className="rounded-xl bg-[#f19b32] px-4 py-2 text-sm font-medium text-black">
            {editingId ? 'Enregistrer' : 'Creer'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-4 py-2 text-sm">
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste des prestations</h2>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Recherche titre, description..."
          className="admin-input"
        />
        {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

        <div className="space-y-3">
          {prestations.map((prestation) => (
            <article key={prestation.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{prestation.title}</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(prestation)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: prestation.id, title: prestation.title })}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/70">{prestation.description}</p>
            </article>
          ))}

          {!loading && prestations.length === 0 ? <p className="text-sm text-white/60">Aucune prestation.</p> : null}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPrev={() => void loadPrestations(Math.max(1, meta.page - 1))}
          onNext={() => void loadPrestations(Math.min(meta.totalPages, meta.page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmer la suppression de cette prestation ?"
        message={deleteTarget ? `Prestation: ${deleteTarget.title}` : undefined}
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
