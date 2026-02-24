'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'

type Project = {
  id: string
  title: string
  slug: string
  description: string
  image: string
  category: string
  createdAt: string
}

type ProjectPayload = Omit<Project, 'id' | 'createdAt'>

const emptyForm: ProjectPayload = {
  title: '',
  slug: '',
  description: '',
  image: '',
  category: '',
}

export function ProjectsAdminClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [form, setForm] = useState<ProjectPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const title = useMemo(() => (editingId ? 'Modifier le projet' : 'Nouveau projet'), [editingId])

  async function loadProjects() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/projects', { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les projets')
      const payload = await res.json()
      setProjects(payload.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProjects()
  }, [])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const isEditing = Boolean(editingId)
    const endpoint = isEditing ? `/api/projects/${editingId}` : '/api/projects'

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
    await loadProjects()
  }

  async function onDelete(id: string) {
    const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: 'Suppression impossible' }))
      setError(payload.error || 'Suppression impossible')
      return
    }

    await loadProjects()
  }

  function onEdit(project: Project) {
    setEditingId(project.id)
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      image: project.image,
      category: project.category,
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
        <Field label="Slug">
          <input
            value={form.slug}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            className="admin-input"
            required
          />
        </Field>
        <Field label="Image URL">
          <input
            value={form.image}
            onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
            className="admin-input"
            required
          />
        </Field>
        <Field label="Catégorie">
          <input
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
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
            {editingId ? 'Enregistrer' : 'Créer'}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-xl border border-white/15 px-4 py-2 text-sm">
              Annuler
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Liste des projets</h2>
        {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

        <div className="space-y-3">
          {projects.map((project) => (
            <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#f19b32]">{project.slug}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs"
                  >
                    Éditer
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project.id)}
                    className="rounded-lg border border-red-400/40 px-3 py-1.5 text-xs text-red-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/70">{project.description}</p>
            </article>
          ))}

          {!loading && projects.length === 0 ? <p className="text-sm text-white/60">Aucun projet.</p> : null}
        </div>
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
