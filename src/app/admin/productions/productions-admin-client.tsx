'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { MediaUploadInput } from '../components/media-upload-input'
import { ConfirmDialog } from '../components/confirm-dialog'

type Option = { id: string; name: string; slug?: string }

type Production = {
  id: string
  title: string
  slug: string
  description: string
  image: string
  category: string
  youtubeUrl?: string | null
  country?: string | null
  region?: string | null
  viewCount: number
  watchTimeMinutes: number
  abandonmentRate: number
  status: 'DRAFT' | 'IN_PRODUCTION' | 'COMPLETED'
  isActive: boolean
  tags?: string[] | null
  artistes?: { artiste: Option }[]
  partenaires?: { partenaire: Option }[]
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type ProductionPayload = {
  title: string
  slug: string
  description: string
  image: string
  category: string
  youtubeUrl: string
  country: string
  region: string
  viewCount: number
  watchTimeMinutes: number
  abandonmentRate: number
  status: 'DRAFT' | 'IN_PRODUCTION' | 'COMPLETED'
  isActive: boolean
  tagsText: string
  artisteIds: string[]
  partenaireIds: string[]
}

const emptyForm: ProductionPayload = {
  title: '',
  slug: '',
  description: '',
  image: '',
  category: '',
  youtubeUrl: '',
  country: '',
  region: '',
  viewCount: 0,
  watchTimeMinutes: 0,
  abandonmentRate: 0,
  status: 'DRAFT',
  isActive: true,
  tagsText: '',
  artisteIds: [],
  partenaireIds: [],
}

export function ProductionsAdminClient() {
  const [productions, setProductions] = useState<Production[]>([])
  const [artistesOptions, setArtistesOptions] = useState<Option[]>([])
  const [partenairesOptions, setPartenairesOptions] = useState<Option[]>([])
  const [form, setForm] = useState<ProductionPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 8, total: 0, totalPages: 1 })
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier la production' : 'Nouvelle production'), [editingId])
  const knownCategories = useMemo(() => {
    const fromList = productions.map((item) => item.category).filter(Boolean)
    return Array.from(new Set(fromList)).sort((a, b) => a.localeCompare(b))
  }, [productions])
  const statusLabel = useMemo(
    () =>
      ({
        DRAFT: 'Draft',
        IN_PRODUCTION: 'En production',
        COMPLETED: 'Termine',
      }) as const,
    [],
  )

  function parseTags(value: string) {
    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  async function loadDictionaries() {
    try {
      const [artistesRes, partenairesRes] = await Promise.all([
        fetch('/api/artistes?page=1&pageSize=200&seedPublic=true', { cache: 'no-store' }),
        fetch('/api/partenaires?page=1&pageSize=200&seedPublic=true', { cache: 'no-store' }),
      ])

      const artistesPayload = artistesRes.ok ? await artistesRes.json() : { data: [] }
      const partenairesPayload = partenairesRes.ok ? await partenairesRes.json() : { data: [] }

      setArtistesOptions(
        (artistesPayload.data || []).map((item: { id: string; name: string; slug: string }) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
        })),
      )
      setPartenairesOptions(
        (partenairesPayload.data || []).map((item: { id: string; name: string }) => ({
          id: item.id,
          name: item.name,
        })),
      )
    } catch {
      setArtistesOptions([])
      setPartenairesOptions([])
    }
  }

  async function loadProductions(nextPage = meta.page) {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(meta.pageSize),
      })
      if (q.trim()) params.set('q', q.trim())
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (categoryFilter.trim()) params.set('category', categoryFilter.trim())

      const res = await fetch(`/api/productions?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les productions')
      const payload = await res.json()
      setProductions(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger les productions (vérifie migration DB / connexion PostgreSQL)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDictionaries()
  }, [])

  useEffect(() => {
    void loadProductions(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, statusFilter, categoryFilter])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const isEditing = Boolean(editingId)
    const endpoint = isEditing ? `/api/productions/${editingId}` : '/api/productions'

    const response = await fetch(endpoint, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: parseTags(form.tagsText),
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Action impossible' }))
      setError(payload.error || 'Action impossible')
      return
    }

    resetForm()
    await loadProductions(meta.page)
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const response = await fetch(`/api/productions/${deleteTarget.id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      setIsDeleting(false)
      return
    }

    setDeleteTarget(null)
    setIsDeleting(false)
    await loadProductions(meta.page)
  }

  function onEdit(production: Production) {
    setEditingId(production.id)
    setForm({
      title: production.title,
      slug: production.slug,
      description: production.description,
      image: production.image,
      category: production.category,
      youtubeUrl: production.youtubeUrl || '',
      country: production.country || '',
      region: production.region || '',
      viewCount: Number(production.viewCount || 0),
      watchTimeMinutes: Number(production.watchTimeMinutes || 0),
      abandonmentRate: Number(production.abandonmentRate || 0),
      status: production.status,
      isActive: production.isActive,
      tagsText: (production.tags || []).join(', '),
      artisteIds: production.artistes?.map((item) => item.artiste.id) || [],
      partenaireIds: production.partenaires?.map((item) => item.partenaire.id) || [],
    })
  }

  function toggleInArray(values: string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
  }

  function onOpenYoutubeUrl() {
    const url = form.youtubeUrl.trim()
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
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

        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            className="admin-input"
            required
          />
        </Field>

        <MediaUploadInput
          label="Image URL"
          value={form.image}
          onChange={(value) => setForm((p) => ({ ...p, image: value }))}
          required
        />

        <Field label="Categorie">
          <input
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            className="admin-input"
            required
          />
        </Field>

        <Field label="YouTube URL (optionnel)">
          <div className="flex gap-2">
            <input
              value={form.youtubeUrl || ''}
              onChange={(e) => setForm((p) => ({ ...p, youtubeUrl: e.target.value }))}
              className="admin-input"
              placeholder="https://youtu.be/..."
            />
            <button
              type="button"
              onClick={onOpenYoutubeUrl}
              disabled={!form.youtubeUrl.trim()}
              className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Verifier
            </button>
          </div>
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

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Vues">
            <input
              type="number"
              min={0}
              value={form.viewCount}
              onChange={(e) => setForm((p) => ({ ...p, viewCount: Math.max(0, Number(e.target.value || 0)) }))}
              className="admin-input"
            />
          </Field>
          <Field label="Temps de visionnage (min)">
            <input
              type="number"
              min={0}
              value={form.watchTimeMinutes}
              onChange={(e) => setForm((p) => ({ ...p, watchTimeMinutes: Math.max(0, Number(e.target.value || 0)) }))}
              className="admin-input"
            />
          </Field>
          <Field label="Taux d abandon (%)">
            <input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={form.abandonmentRate}
              onChange={(e) =>
                setForm((p) => ({ ...p, abandonmentRate: Math.min(100, Math.max(0, Number(e.target.value || 0))) }))
              }
              className="admin-input"
            />
          </Field>
        </div>

        <Field label="Statut">
          <select
            value={form.status}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                status: e.target.value as 'DRAFT' | 'IN_PRODUCTION' | 'COMPLETED',
              }))
            }
            className="admin-input"
          >
            <option value="DRAFT">Draft</option>
            <option value="IN_PRODUCTION">En production</option>
            <option value="COMPLETED">Termine</option>
          </select>
        </Field>

        <Field label="Tags (separes par virgules)">
          <input
            value={form.tagsText}
            onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
            className="admin-input"
            placeholder="show live, captation, branding"
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

        <MultiSelect
          title="Artistes associes"
          options={artistesOptions}
          values={form.artisteIds}
          onToggle={(value) => setForm((p) => ({ ...p, artisteIds: toggleInArray(p.artisteIds, value) }))}
        />

        <MultiSelect
          title="Partenaires associes"
          options={partenairesOptions}
          values={form.partenaireIds}
          onToggle={(value) => setForm((p) => ({ ...p, partenaireIds: toggleInArray(p.partenaireIds, value) }))}
        />

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
          />
          Production active
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
        <h2 className="text-xl font-semibold">Liste des productions</h2>
        <div className="grid gap-2 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche titre, categorie..."
            className="admin-input"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input">
            <option value="all">Tous les statuts</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_PRODUCTION">En production</option>
            <option value="COMPLETED">Termine</option>
          </select>
          <input
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="Filtre categorie"
            className="admin-input"
            list="categories-productions"
          />
          <datalist id="categories-productions">
            {knownCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
        {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

        <div className="space-y-3">
          {productions.map((production) => (
            <article key={production.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{production.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#f19b32]">{production.slug}</p>
                    <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] uppercase text-white/75">
                      {statusLabel[production.status]}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                        production.isActive
                          ? 'border border-emerald-400/40 text-emerald-300'
                          : 'border border-white/20 text-white/65'
                      }`}
                    >
                      {production.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(production)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: production.id, title: production.title })}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/70">{production.description}</p>
              {(production.tags || []).length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(production.tags || []).map((tag) => (
                    <span key={`${production.id}-${tag}`} className="rounded-full border border-[#f19b32]/30 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#f19b32]">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}

          {!loading && productions.length === 0 ? <p className="text-sm text-white/60">Aucune production.</p> : null}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPrev={() => void loadProductions(Math.max(1, meta.page - 1))}
          onNext={() => void loadProductions(Math.min(meta.totalPages, meta.page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmer la suppression de cette production ?"
        message={deleteTarget ? `Production: ${deleteTarget.title}` : undefined}
        loading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void onConfirmDelete()}
      />
    </div>
  )
}

function MultiSelect({
  title,
  options,
  values,
  onToggle,
}: {
  title: string
  options: Option[]
  values: string[]
  onToggle: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.16em] text-white/55">{title}</p>
      <div className="max-h-28 space-y-1 overflow-auto rounded-xl border border-white/10 bg-black/30 p-2">
        {options.length === 0 ? (
          <p className="text-xs text-white/50">Aucune option</p>
        ) : (
          options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 text-xs text-white/80">
              <input type="checkbox" checked={values.includes(option.id)} onChange={() => onToggle(option.id)} />
              {option.name}
            </label>
          ))
        )}
      </div>
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
