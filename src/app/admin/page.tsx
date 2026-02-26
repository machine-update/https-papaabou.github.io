import {
  Activity,
  BarChart3,
  Clapperboard,
  Globe2,
  Mic2,
  Radio,
  Sparkles,
  Tv,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
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

  const dashboardTabs = [
    { label: 'Vue générale', icon: BarChart3 },
    { label: 'Productions', icon: Clapperboard },
    { label: 'Artistes', icon: Mic2 },
    { label: 'Partenaires', icon: Users },
    { label: 'Audience', icon: Globe2 },
    { label: 'Analytics', icon: Activity },
  ]

  const topByViews = data.contentPerformance.topByViews.slice(0, 10)
  const featuredContents = topByViews.slice(0, 5)
  const audiencePoints = [
    { x: '18%', y: '42%', size: 'h-5 w-5', tone: 'bg-emerald-400/85' },
    { x: '39%', y: '22%', size: 'h-4 w-4', tone: 'bg-emerald-300/70' },
    { x: '63%', y: '30%', size: 'h-3 w-3', tone: 'bg-emerald-300/60' },
    { x: '72%', y: '58%', size: 'h-5 w-5', tone: 'bg-emerald-400/80' },
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

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-2">
        <div className="flex flex-wrap gap-2">
          {dashboardTabs.map((tab, index) => {
            const Icon = tab.icon
            const active = index === 0
            return (
              <button
                key={tab.label}
                type="button"
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                  active
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-transparent text-white/70 hover:border-white/15 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </section>

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
        {headCounters.map((stat) => {
          const iconMap: Record<string, LucideIcon> = {
            Productions: Clapperboard,
            Artistes: Mic2,
            Partenaires: Users,
            Utilisateurs: UserRound,
          }
          const colorMap: Record<string, string> = {
            Productions: 'text-violet-300 bg-violet-500/15 border-violet-400/25',
            Artistes: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/25',
            Partenaires: 'text-amber-300 bg-amber-500/15 border-amber-400/25',
            Utilisateurs: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/25',
          }
          const Icon = iconMap[stat.label] ?? Sparkles
          const tone = colorMap[stat.label] ?? 'text-[#f19b32] bg-[#f19b32]/15 border-[#f19b32]/30'

          return (
            <article
              key={stat.label}
              className="group rounded-2xl border border-white/10 bg-[#131313] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">{stat.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
                </div>
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </article>
          )
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-2xl border border-white/10 bg-[#131313] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.45)]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Visites du site web</p>
              <h3 className="mt-1 text-xl font-semibold">Visualiser les visiteurs par zones</h3>
            </div>
            <div className="inline-flex rounded-xl border border-white/10 bg-black/30 p-1 text-xs">
              {['Aujourd’hui', '7J', '30J'].map((range, idx) => (
                <span
                  key={range}
                  className={`rounded-lg px-3 py-1 ${idx === 2 ? 'bg-white/10 text-white' : 'text-white/65'}`}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mt-4 h-[250px] overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <div className="absolute left-4 top-4 rounded-xl border border-white/10 bg-black/80 p-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Visiteurs</p>
              <p className="mt-1 text-3xl font-semibold text-white">{data.executiveOverview.monthlyPublications.value}</p>
              <p className="text-xs text-emerald-300">+{Math.max(data.executiveOverview.growthRate.value, 0).toFixed(1)}% vs période précédente</p>
            </div>
            {audiencePoints.map((point) => (
              <span
                key={`${point.x}-${point.y}`}
                className={`absolute ${point.size} ${point.tone} rounded-full shadow-[0_0_22px_rgba(16,185,129,0.55)]`}
                style={{ left: point.x, top: point.y }}
              />
            ))}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1 text-xs text-white/70">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Top audience
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-[#131313] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.45)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Contenus Top 10</p>
          <h3 className="mt-1 text-xl font-semibold">Classement par vues</h3>
          <div className="mt-4 space-y-2">
            {topByViews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/20 bg-black/30 p-4 text-sm text-white/60">
                Aucune donnée disponible.
              </p>
            ) : (
              topByViews.map((item, idx) => (
                <article
                  key={`${item.label}-${idx}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white/85">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-white/90">{item.label}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-xs text-white/70">
                    <Tv className="h-3.5 w-3.5" />
                    {item.value}
                  </div>
                </article>
              ))
            )}
          </div>
        </article>
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

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-white/10 bg-[#131313] p-5 shadow-[0_20px_48px_rgba(0,0,0,0.45)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#f19b32]">Contenus Vedette</p>
              <h3 className="mt-1 text-xl font-semibold">Sélection premium</h3>
            </div>
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/65">
              {featuredContents.length} éléments
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {featuredContents.length === 0 ? (
              <p className="sm:col-span-2 xl:col-span-5 rounded-xl border border-dashed border-white/20 bg-black/30 p-4 text-sm text-white/60">
                Aucun contenu vedette pour le moment.
              </p>
            ) : (
              featuredContents.map((item, idx) => (
                <article
                  key={`${item.label}-${idx}`}
                  className="rounded-xl border border-white/10 bg-black/35 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="inline-flex rounded-full border border-white/20 px-2 py-0.5 text-[11px] text-white/70">#{idx + 1}</div>
                  <p className="mt-3 line-clamp-2 text-sm font-medium text-white/90">{item.label}</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-emerald-300">
                    <Radio className="h-3.5 w-3.5" />
                    {item.value} vues
                  </div>
                </article>
              ))
            )}
          </div>
        </article>

        <DonutChart title="Répartition des médias" subtitle="Distribution par type de contenu" data={data.charts.statusOverview} />
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
