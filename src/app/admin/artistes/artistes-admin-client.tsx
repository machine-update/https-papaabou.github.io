'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { MediaUploadInput } from '../components/media-upload-input'
import { ConfirmDialog } from '../components/confirm-dialog'

type ArtistStat = { label: string; value: string }
type ArtistSocial = { label: string; url: string }

type Artiste = {
  id: string
  name: string
  slug: string
  role: string
  country?: string | null
  region?: string | null
  performanceScore: number
  shortBio?: string | null
  bio: string
  photo: string
  stats?: ArtistStat[] | null
  highlights?: string[] | null
  bookingFormats?: string[] | null
  socials?: ArtistSocial[] | null
  featured: boolean
  isActive: boolean
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type ArtistePayload = {
  name: string
  slug: string
  role: string
  country: string
  region: string
  performanceScore: number
  shortBio: string
  bio: string
  photo: string
  stats: ArtistStat[]
  highlights: string[]
  bookingFormats: string[]
  socials: ArtistSocial[]
  featured: boolean
  isActive: boolean
}

type FormState = {
  name: string
  slug: string
  role: string
  country: string
  region: string
  performanceScore: number
  shortBio: string
  bio: string
  photo: string
  statsText: string
  highlightsText: string
  bookingFormatsText: string
  socialsText: string
  featured: boolean
  isActive: boolean
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  role: '',
  country: '',
  region: '',
  performanceScore: 0,
  shortBio: '',
  bio: '',
  photo: '',
  statsText: '',
  highlightsText: '',
  bookingFormatsText: '',
  socialsText: '',
  featured: false,
  isActive: true,
}

function toLines(list: string[] | null | undefined) {
  return (list || []).join('\n')
}

function toStatsLines(list: ArtistStat[] | null | undefined) {
  return (list || []).map((item) => `${item.label}:${item.value}`).join('\n')
}

function toSocialLines(list: ArtistSocial[] | null | undefined) {
  return (list || []).map((item) => `${item.label}|${item.url}`).join('\n')
}

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseStats(value: string) {
  return parseLines(value)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      const parsedLabel = label?.trim()
      const parsedValue = rest.join(':').trim()
      if (!parsedLabel || !parsedValue) return null
      return { label: parsedLabel, value: parsedValue }
    })
    .filter((item): item is ArtistStat => Boolean(item))
}

function parseSocials(value: string) {
  return parseLines(value)
    .map((line) => {
      const [label, ...rest] = line.split('|')
      const parsedLabel = label?.trim()
      const parsedUrl = rest.join('|').trim()
      if (!parsedLabel || !parsedUrl) return null
      return { label: parsedLabel, url: parsedUrl }
    })
    .filter((item): item is ArtistSocial => Boolean(item))
}

function toPayload(form: FormState): ArtistePayload {
  return {
    name: form.name,
    slug: form.slug,
    role: form.role,
    country: form.country,
    region: form.region,
    performanceScore: form.performanceScore,
    shortBio: form.shortBio,
    bio: form.bio,
    photo: form.photo,
    stats: parseStats(form.statsText),
    highlights: parseLines(form.highlightsText),
    bookingFormats: parseLines(form.bookingFormatsText),
    socials: parseSocials(form.socialsText),
    featured: form.featured,
    isActive: form.isActive,
  }
}

export function ArtistesAdminClient() {
  const [artistes, setArtistes] = useState<Artiste[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 8, total: 0, totalPages: 1 })
  const [q, setQ] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier l artiste' : 'Nouvel artiste'), [editingId])

  async function loadArtistes(nextPage = meta.page) {
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
      const res = await fetch(`/api/artistes?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les artistes')
      const payload = await res.json()
      setArtistes(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger les artistes (verifie migration DB / connexion PostgreSQL)')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadArtistes(1)
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
    const endpoint = isEditing ? `/api/artistes/${editingId}` : '/api/artistes'

    const response = await fetch(endpoint, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(form)),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Action impossible' }))
      setError(payload.error || 'Action impossible')
      return
    }

    resetForm()
    await loadArtistes(meta.page)
  }

  async function onConfirmDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    const response = await fetch(`/api/artistes/${deleteTarget.id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      setIsDeleting(false)
      return
    }

    setDeleteTarget(null)
    setIsDeleting(false)
    await loadArtistes(meta.page)
  }

  function onEdit(artiste: Artiste) {
    setEditingId(artiste.id)
    setForm({
      name: artiste.name,
      slug: artiste.slug,
      role: artiste.role,
      country: artiste.country ?? '',
      region: artiste.region ?? '',
      performanceScore: Number(artiste.performanceScore || 0),
      shortBio: artiste.shortBio ?? '',
      bio: artiste.bio,
      photo: artiste.photo,
      statsText: toStatsLines(artiste.stats),
      highlightsText: toLines(artiste.highlights),
      bookingFormatsText: toLines(artiste.bookingFormats),
      socialsText: toSocialLines(artiste.socials),
      featured: artiste.featured,
      isActive: artiste.isActive,
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

        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            className="admin-input"
            required
          />
        </Field>

        <Field label="Role">
          <input
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            className="admin-input"
            required
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

        <Field label="Score performance (0-100)">
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={form.performanceScore}
            onChange={(e) =>
              setForm((p) => ({ ...p, performanceScore: Math.min(100, Math.max(0, Number(e.target.value || 0))) }))
            }
            className="admin-input"
          />
        </Field>

        <Field label="Short bio (court)">
          <textarea
            value={form.shortBio}
            onChange={(e) => setForm((p) => ({ ...p, shortBio: e.target.value }))}
            className="admin-input min-h-20"
          />
        </Field>

        <MediaUploadInput
          label="Photo URL"
          value={form.photo}
          onChange={(value) => setForm((p) => ({ ...p, photo: value }))}
          required
        />

        <Field label="Bio longue">
          <textarea
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            className="admin-input min-h-28"
            required
          />
        </Field>

        <Field label="Stats (ligne = label:value)">
          <textarea
            value={form.statsText}
            onChange={(e) => setForm((p) => ({ ...p, statsText: e.target.value }))}
            className="admin-input min-h-24"
            placeholder={'Positionnement:Grand public\nFormat fort:Show live\nLangue:Francais'}
          />
        </Field>

        <Field label="Temps forts (ligne = item)">
          <textarea
            value={form.highlightsText}
            onChange={(e) => setForm((p) => ({ ...p, highlightsText: e.target.value }))}
            className="admin-input min-h-24"
          />
        </Field>

        <Field label="Formats booking (ligne = format)">
          <textarea
            value={form.bookingFormatsText}
            onChange={(e) => setForm((p) => ({ ...p, bookingFormatsText: e.target.value }))}
            className="admin-input min-h-24"
          />
        </Field>

        <Field label="Reseaux (ligne = label|url)">
          <textarea
            value={form.socialsText}
            onChange={(e) => setForm((p) => ({ ...p, socialsText: e.target.value }))}
            className="admin-input min-h-24"
            placeholder={'Instagram|https://instagram.com/...\nYouTube|https://youtube.com/...'}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
          />
          Artiste a la une
        </label>

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
          />
          Artiste actif
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
        <h2 className="text-xl font-semibold">Liste des artistes</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recherche nom, role, bio..."
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
          {artistes.map((artiste) => (
            <article key={artiste.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{artiste.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#f19b32]">{artiste.role}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                        artiste.isActive
                          ? 'border border-emerald-400/40 text-emerald-300'
                          : 'border border-white/20 text-white/60'
                      }`}
                    >
                      {artiste.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(artiste)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Editer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: artiste.id, name: artiste.name })}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/70">{artiste.shortBio || artiste.bio}</p>
            </article>
          ))}

          {!loading && artistes.length === 0 ? <p className="text-sm text-white/60">Aucun artiste.</p> : null}
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          onPrev={() => void loadArtistes(Math.max(1, meta.page - 1))}
          onNext={() => void loadArtistes(Math.min(meta.totalPages, meta.page + 1))}
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirmer la suppression de cet artiste ?"
        message={deleteTarget ? `Artiste: ${deleteTarget.name}` : undefined}
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
