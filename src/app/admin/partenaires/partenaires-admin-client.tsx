'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { MediaUploadInput } from '../components/media-upload-input'
import { ConfirmDialog } from '../components/confirm-dialog'

type Partenaire = {
  id: string
  name: string
  logo: string | null
  website: string | null
  country: string | null
  region: string | null
  riskScore: number
  isActive: boolean
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type PartenairePayload = {
  name: string
  logo: string
  website: string
  country: string
  region: string
  riskScore: number
  isActive: boolean
}

const emptyForm: PartenairePayload = {
  name: '',
  logo: '',
  website: '',
  country: '',
  region: '',
  riskScore: 0,
  isActive: true,
}

export function PartenairesAdminClient() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([])
  const [form, setForm] = useState<PartenairePayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 1 })
  const [q, setQ] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier le partenaire' : 'Nouveau partenaire'), [editingId])

  async function loadPartenaires(nextPage = meta.page) {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(meta.pageSize),
      })
      if (q.trim()) params.set('q', q.trim())
      if (activeFilter !== 'all') params.set('active', activeFilter)

      params.set('seedPublic', 'true')
      const res = await fetch(`/api/partenaires?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les partenaires')
      const payload = await res.json()
      setPartenaires(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger les partenaires (verifie migration DB / connexion PostgreSQL)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPartenaires(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, activeFilter])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const isEditing = Boolean(editingId)
    const endpoint = isEditing ? `/api/partenaires/${editingId}` : '/api/partenaires'

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
    await loadPartenaires(meta.page)
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const response = await fetch(`/api/partenaires/${deleteTarget.id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      setIsDeleting(false)
      return
    }

    setDeleteTarget(null)
    setIsDeleting(false)
    await loadPartenaires(meta.page)
  }

  function onEdit(partenaire: Partenaire) {
    setEditingId(partenaire.id)
    setForm({
      name: partenaire.name,
      logo: partenaire.logo ?? '',
      website: partenaire.website ?? '',
      country: partenaire.country ?? '',
      region: partenaire.region ?? '',
      riskScore: Number(partenaire.riskScore || 0),
      isActive: partenaire.isActive,
    })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Field label="Nom">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="admin-input"
            required
          />
        </Field>

        <MediaUploadInput
          label="Logo URL (optionnel)"
          value={form.logo}
          onChange={(value) => setForm((p) => ({ ...p, logo: value }))}
        />

        <Field label="Site web (optionnel)">
          <input
            value={form.website}
            onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
            className="admin-input"
          />
        </Field>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Pays (optionnel)">
            <input
              value={form.country}
              onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              className="admin-input"
              placeholder="France, Senegal..."
            />
          </Field>
          <Field label="Region (optionnel)">
            <input
              value={form.region}
              onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
              className="admin-input"
              placeholder="Europe, Afrique..."
            />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          <Field label="Score risque (0-100)">
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={form.riskScore}
              onChange={(e) => setForm((p) => ({ ...p, riskScore: Math.min(100, Math.max(0, Number(e.target.value || 0))) }))}
              className="admin-input"
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
          />
          Partenaire actif
        </label>

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
        <h2 className="text-xl font-semibold">Liste des partenaires</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche nom partenaire..."
            className="admin-input"
          />
          <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)} className="admin-input">
            <option value="all">Tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
        </div>
        {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

        <div className="space-y-3">
          {partenaires.map((partenaire) => (
            <article key={partenaire.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{partenaire.name}</h3>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase ${
                      partenaire.isActive
                        ? 'border border-emerald-400/40 text-emerald-300'
                        : 'border border-white/20 text-white/65'
                    }`}
                  >
                    {partenaire.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(partenaire)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: partenaire.id, name: partenaire.name })}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mt-2 text-sm text-white/70">
                {partenaire.website ? <p>Site: {partenaire.website}</p> : null}
                {partenaire.logo ? <p>Logo: {partenaire.logo}</p> : null}
              </div>
            </article>
          ))}

          {!loading && partenaires.length === 0 ? <p className="text-sm text-white/60">Aucun partenaire.</p> : null}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPrev={() => void loadPartenaires(Math.max(1, meta.page - 1))}
          onNext={() => void loadPartenaires(Math.min(meta.totalPages, meta.page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmer la suppression de ce partenaire ?"
        message={deleteTarget ? `Partenaire: ${deleteTarget.name}` : undefined}
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
