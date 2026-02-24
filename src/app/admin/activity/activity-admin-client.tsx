'use client'

import { useEffect, useState } from 'react'

type AdminLog = {
  id: string
  email: string
  action: string
  entity: string
  entityId: string | null
  createdAt: string
}

type PaginationMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function ActivityAdminClient() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, pageSize: 20, total: 0, totalPages: 1 })
  const [entity, setEntity] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadLogs(nextPage = meta.page) {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ page: String(nextPage), pageSize: String(meta.pageSize) })
      if (entity !== 'all') params.set('entity', entity)

      const res = await fetch(`/api/admin-activity?${params.toString()}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Impossible de charger les logs')

      const payload = await res.json()
      setLogs(payload.data || [])
      setMeta((prev) => ({
        ...prev,
        page: payload.meta?.page || nextPage,
        pageSize: payload.meta?.pageSize || prev.pageSize,
        total: payload.meta?.total || 0,
        totalPages: payload.meta?.totalPages || 1,
      }))
    } catch {
      setError('Impossible de charger l activite admin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadLogs(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={entity} onChange={(e) => setEntity(e.target.value)} className="admin-input max-w-xs">
          <option value="all">Toutes les entites</option>
          <option value="USER">Utilisateurs</option>
          <option value="PRODUCTION">Productions</option>
          <option value="ARTISTE">Artistes</option>
          <option value="PRESTATION">Prestations</option>
          <option value="PARTENAIRE">Partenaires</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {loading ? <p className="text-sm text-white/60">Chargement...</p> : null}

      {!loading && logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 bg-black/25 p-6 text-sm text-white/60">
          Aucun log pour ce filtre.
        </div>
      ) : null}

      <div className="space-y-2">
        {logs.map((log) => (
          <article key={log.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm">
                <span className="rounded-full border border-[#f19b32]/35 px-2 py-1 text-[10px] uppercase text-[#f19b32]">{log.action}</span>{' '}
                <span className="ml-2 font-medium">{log.entity}</span>
                {log.entityId ? <span className="ml-2 text-white/50">#{log.entityId.slice(0, 8)}</span> : null}
              </p>
              <p className="text-xs text-white/60">{new Date(log.createdAt).toLocaleString('fr-FR')}</p>
            </div>
            <p className="mt-1 text-xs text-white/55">Par {log.email}</p>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm">
        <p className="text-white/65">
          Page {meta.page}/{Math.max(meta.totalPages, 1)} • {meta.total} logs
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadLogs(Math.max(1, meta.page - 1))}
            disabled={meta.page <= 1}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Precedent
          </button>
          <button
            type="button"
            onClick={() => void loadLogs(Math.min(meta.totalPages, meta.page + 1))}
            disabled={meta.page >= meta.totalPages}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
