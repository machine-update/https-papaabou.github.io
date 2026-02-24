import { BarChart } from './components/charts/bar-chart'
import { DonutChart } from './components/charts/donut-chart'
import { LineChart } from './components/charts/line-chart'
import { Sparkline } from './components/charts/sparkline'
import { ExportPdfButton } from './components/export-pdf-button'
import { DashboardFilters } from './components/dashboard-filters'
import { getAdminDashboardData } from '@/lib/admin-dashboard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; q?: string }>
}) {
  const resolved = await searchParams
  const parsedPeriod = Number(resolved.period)
  const periodDays = parsedPeriod === 7 || parsedPeriod === 30 || parsedPeriod === 90 ? parsedPeriod : 30
  const data = await getAdminDashboardData({ periodDays, q: resolved.q || '' })
  const recentLogs = data.insights.recentLogs as Array<{
    id: string
    email: string
    action: string
    entity: string
    createdAt: Date | string
  }>

  const headCounters = [
    { label: 'Productions', value: data.counters.productionsTotal },
    { label: 'Artistes', value: data.counters.artistesTotal },
    { label: 'Partenaires', value: data.counters.partenairesTotal },
    { label: 'Utilisateurs', value: data.counters.usersTotal },
  ]

  const executiveCards = [
    {
      label: 'Publications ce mois',
      value: `${data.executiveOverview.monthlyPublications.value}`,
      delta: data.executiveOverview.monthlyPublications.delta,
      sparkline: data.executiveOverview.monthlyPublications.sparkline,
    },
    {
      label: 'Croissance',
      value: `${data.executiveOverview.growthRate.value.toFixed(1)}%`,
      delta: data.executiveOverview.growthRate.delta,
      sparkline: data.executiveOverview.growthRate.sparkline,
    },
    {
      label: 'Rétention contenu',
      value: `${data.executiveOverview.retentionRate.value.toFixed(1)}%`,
      delta: data.executiveOverview.retentionRate.delta,
      sparkline: data.executiveOverview.retentionRate.sparkline,
    },
    {
      label: 'Visionnage moyen',
      value: `${data.executiveOverview.averageWatchTime.value.toFixed(1)} min`,
      delta: data.executiveOverview.averageWatchTime.delta,
      sparkline: data.executiveOverview.averageWatchTime.sparkline,
    },
    {
      label: 'Productions actives',
      value: `${data.executiveOverview.activeProductionRate.value.toFixed(1)}%`,
      delta: data.executiveOverview.activeProductionRate.delta,
      sparkline: data.executiveOverview.activeProductionRate.sparkline,
    },
    {
      label: 'Taux de publication',
      value: `${data.executiveOverview.completionRate.value.toFixed(1)}%`,
      delta: data.executiveOverview.completionRate.delta,
      sparkline: data.executiveOverview.completionRate.sparkline,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#f19b32]">Tableau de bord studio</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Centre de pilotage contenu</h1>
          <p className="mt-2 text-sm text-white/60">Pilotage éditorial studio: performance contenu, qualité catalogue, pipeline et signaux opérationnels.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <DashboardFilters />
          <ExportPdfButton />
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {data.alerts.map((alert) => (
          <article key={alert.key} className="rounded-xl border border-white/10 bg-black/30 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">{alert.label}</p>
            <p
              className={`mt-2 text-sm font-medium ${
                alert.level === 'high' ? 'text-red-300' : alert.level === 'medium' ? 'text-[#f19b32]' : 'text-emerald-300'
              }`}
            >
              {alert.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {headCounters.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-[#f19b32]">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[#f19b32]/30 bg-gradient-to-br from-[#0f0f0f] to-black p-5 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#f19b32]">Vue d’ensemble</p>
          <h2 className="mt-1 text-2xl font-semibold">Indicateurs stratégiques contenu</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {executiveCards.map((item) => (
            <article key={item.label} className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              <p className={`mt-1 text-xs ${item.delta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {item.delta >= 0 ? '▲' : '▼'} {Math.abs(item.delta).toFixed(1)}% vs période précédente
              </p>
              <div className="mt-3">
                <Sparkline data={item.sparkline} positive={item.delta >= 0} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <LineChart title="Croissance des productions" subtitle="Productions créées par mois" data={data.charts.productionGrowthSeries} />
        <LineChart title="Croissance des utilisateurs" subtitle="Utilisateurs créés par mois" data={data.charts.userGrowthSeries} />
        <LineChart title="Évolution des vues" subtitle="Vues réelles par mois" data={data.charts.viewsSeries} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Performance contenu</p>
              <h3 className="mt-1 text-xl font-semibold">Top 5 productions par vues</h3>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/70">Filtre: {data.contentPerformance.activeFilters.period}</span>
          </div>
          <BarChart title="Top vues" data={data.contentPerformance.topByViews.map((i) => ({ label: i.label, value: i.value }))} />
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Performance contenu</p>
            <h3 className="mt-1 text-xl font-semibold">Top 5 productions complétion</h3>
          </div>
          <BarChart title="Top complétion" data={data.contentPerformance.topByCompletion.map((i) => ({ label: i.label, value: i.value }))} />
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Carte studio</p>
          <h3 className="mt-1 text-xl font-semibold">Répartition géographique studio</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <BarChart title="Artistes par région" data={data.studioMap.artistsByRegion} />
            <BarChart title="Partenaires par région" data={data.studioMap.partnersByRegion} />
            <BarChart title="Productions par pays" data={data.studioMap.productionsByCountry} />
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Suivi de production</p>
          <h3 className="mt-1 text-xl font-semibold">Suivi des productions</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            <PipelineCol label="Brouillon" value={data.pipeline.draft} />
            <PipelineCol label="En tournage" value={data.pipeline.shooting} />
            <PipelineCol label="Post-prod" value={data.pipeline.postProduction} />
            <PipelineCol label="Validé" value={data.pipeline.validated} />
            <PipelineCol label="Diffusé" value={data.pipeline.distributed} />
          </div>
          <div className="mt-4">
            <DonutChart title="Statut des productions" data={data.charts.statusOverview} />
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Suivi</p>
            <h3 className="mt-1 text-xl font-semibold">Dernière activité admin</h3>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/20 bg-black/30 p-6 text-sm text-white/60">
            Aucune activité journalisée pour le moment.
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <article key={log.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                <div>
                  <p className="text-white">
                    <span className="text-[#f19b32]">{log.action}</span> {log.entity}
                  </p>
                  <p className="text-xs text-white/60">{log.email}</p>
                </div>
                <p className="text-xs text-white/60">{new Date(log.createdAt).toLocaleString('fr-FR')}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PipelineCol({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#f19b32]">{value}</p>
    </div>
  )
}
