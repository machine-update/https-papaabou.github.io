import { prisma } from '@/lib/prisma'

type ProductionRow = {
  id: string
  title: string
  createdAt: Date
  category: string
  country: string | null
  region: string | null
  image: string
  youtubeUrl: string | null
  viewCount: number
  watchTimeMinutes: number
  abandonmentRate: number
  status: 'DRAFT' | 'IN_PRODUCTION' | 'COMPLETED'
  tags: unknown
  artistes: { artisteId: string }[]
}

function monthKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number)
  const date = new Date(y, m - 1, 1)
  return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
}

function getLastMonths(count: number) {
  const now = new Date()
  const result: string[] = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(monthKey(d))
  }
  return result
}

function pctChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

function parseTags(input: unknown) {
  if (!Array.isArray(input)) return []
  return input.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim().toLowerCase())
}

function resolveRegion(region?: string | null, country?: string | null) {
  if (region?.trim()) return region.trim()
  const c = (country || '').trim().toLowerCase()
  if (!c) return 'Global'
  if (c.includes('france') || c.includes('uk') || c.includes('royaume')) return 'Europe'
  if (c.includes('senegal') || c.includes('sénégal') || c.includes('afrique')) return 'Afrique'
  if (c.includes('usa') || c.includes('etats') || c.includes('états')) return 'Amérique du Nord'
  return 'Global'
}

type DashboardOptions = {
  periodDays?: 7 | 30 | 90
  q?: string
}

export async function getAdminDashboardData(options?: DashboardOptions) {
  const periodDays = options?.periodDays || 30
  const query = (options?.q || '').trim().toLowerCase()
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)
  const periodStart = new Date(now)
  periodStart.setDate(now.getDate() - periodDays)

  const [
    productionsTotal,
    productionsDraft,
    productionsInProduction,
    productionsCompleted,
    artistesTotal,
    artistesActive,
    partenairesTotal,
    partenairesActive,
    usersTotal,
    usersNew30d,
    latestProduction,
    recentLogs,
    productionRows,
    userRows,
    artisteRows,
    partenaireRows,
  ] = await Promise.all([
    prisma.production.count(),
    prisma.production.count({ where: { status: 'DRAFT' } }),
    prisma.production.count({ where: { status: 'IN_PRODUCTION' } }),
    prisma.production.count({ where: { status: 'COMPLETED' } }),
    prisma.artiste.count(),
    prisma.artiste.count({ where: { isActive: true } }),
    prisma.partenaire.count(),
    prisma.partenaire.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.production.findFirst({ orderBy: { createdAt: 'desc' }, select: { id: true, title: true, createdAt: true } }),
    prisma.adminActivityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, email: true, action: true, entity: true, createdAt: true },
    }),
    prisma.production.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        category: true,
        country: true,
        region: true,
        image: true,
        youtubeUrl: true,
        viewCount: true,
        watchTimeMinutes: true,
        abandonmentRate: true,
        status: true,
        tags: true,
        artistes: { select: { artisteId: true } },
      },
    }),
    prisma.user.findMany({ select: { createdAt: true } }),
    prisma.artiste.findMany({ select: { id: true, name: true, country: true, region: true, performanceScore: true } }),
    prisma.partenaire.findMany({ select: { id: true, name: true, isActive: true, country: true, region: true, riskScore: true } }),
  ])

  const productionData = productionRows as ProductionRow[]
  const filteredProductions = productionData.filter((row) => {
    const createdInPeriod = row.createdAt >= periodStart
    if (!createdInPeriod) return false
    if (!query) return true
    const tags = parseTags(row.tags).join(' ')
    return `${row.title} ${row.category} ${row.country || ''} ${row.region || ''} ${tags}`.toLowerCase().includes(query)
  })
  const filteredArtists = artisteRows.filter((row) => {
    if (!query) return true
    return `${row.name} ${row.country || ''} ${row.region || ''}`.toLowerCase().includes(query)
  })
  const filteredPartners = partenaireRows.filter((row) => {
    if (!query) return true
    return `${row.name} ${row.country || ''} ${row.region || ''}`.toLowerCase().includes(query)
  })
  const months = getLastMonths(8)
  const productionByMonth = Object.fromEntries(months.map((m) => [m, 0])) as Record<string, number>
  const usersByMonth = Object.fromEntries(months.map((m) => [m, 0])) as Record<string, number>
  const viewsByMonth = Object.fromEntries(months.map((m) => [m, 0])) as Record<string, number>
  const watchMinutesByMonth = Object.fromEntries(months.map((m) => [m, 0])) as Record<string, number>

  for (const row of filteredProductions) {
    const key = monthKey(row.createdAt)
    if (key in productionByMonth) {
      productionByMonth[key] += 1
      viewsByMonth[key] += row.viewCount
      watchMinutesByMonth[key] += row.watchTimeMinutes
    }
  }
  for (const row of userRows) {
    const key = monthKey(row.createdAt)
    if (key in usersByMonth) usersByMonth[key] += 1
  }

  const productionGrowthSeries = months.map((m) => ({ label: monthLabel(m), value: productionByMonth[m] }))
  const userGrowthSeries = months.map((m) => ({ label: monthLabel(m), value: usersByMonth[m] }))
  const viewsSeries = months.map((m) => ({ label: monthLabel(m), value: viewsByMonth[m] }))

  const categoryMap = new Map<string, number>()
  for (const row of filteredProductions) {
    const key = row.category?.trim() || 'Sans catégorie'
    categoryMap.set(key, (categoryMap.get(key) || 0) + 1)
  }
  const categoryDistribution = Array.from(categoryMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  const statusOverview = [
    { label: 'Draft', value: productionsDraft },
    { label: 'En production', value: productionsInProduction },
    { label: 'Terminé', value: productionsCompleted },
  ]

  const previousMonthKey = months[months.length - 2]
  const currentMonthKey = months[months.length - 1]
  const prevProductions = productionByMonth[previousMonthKey] || 0
  const currentProductions = productionByMonth[currentMonthKey] || 0
  const monthlyGrowthPct = pctChange(currentProductions, prevProductions)
  const publicationRate = productionsTotal > 0 ? (productionsCompleted / productionsTotal) * 100 : 0
  const activeProductionRate = productionsTotal > 0 ? ((productionsInProduction + productionsCompleted) / productionsTotal) * 100 : 0

  const totalViews = filteredProductions.reduce((acc, row) => acc + row.viewCount, 0)
  const totalWatchMinutes = filteredProductions.reduce((acc, row) => acc + row.watchTimeMinutes, 0)
  const avgWatchTime = totalViews > 0 ? totalWatchMinutes / totalViews : 0
  const abandonmentRate = filteredProductions.length
    ? filteredProductions.reduce((acc, row) => acc + row.abandonmentRate, 0) / filteredProductions.length
    : 0
  const retentionRate = clamp(100 - abandonmentRate, 0, 100)

  const viewsTop = filteredProductions
    .map((row) => ({ id: row.id, label: row.title, value: row.viewCount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const completionTop = filteredProductions
    .map((row) => ({
      id: row.id,
      label: row.title,
      value: Number((100 - clamp(row.abandonmentRate, 0, 100)).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const artistPerfMap = new Map<string, number>()
  const artistNameById = new Map(filteredArtists.map((a) => [a.id, a.name]))
  const baseArtistScore = new Map(filteredArtists.map((a) => [a.id, a.performanceScore || 0]))
  for (const row of filteredProductions) {
    const links = row.artistes.length || 1
    const distributedViews = row.viewCount / links
    for (const link of row.artistes) {
      const current = artistPerfMap.get(link.artisteId) || 0
      const bonus = baseArtistScore.get(link.artisteId) || 0
      artistPerfMap.set(link.artisteId, current + distributedViews * 0.01 + bonus)
    }
  }
  const artistsTop = Array.from(artistPerfMap.entries())
    .map(([id, value]) => ({ id, label: artistNameById.get(id) || 'Artiste', value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  let postProduction = 0
  let distributed = 0
  const tagMap = new Map<string, number>()
  for (const row of filteredProductions) {
    const tags = parseTags(row.tags)
    for (const tag of tags) tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    if (tags.includes('post-prod') || tags.includes('postproduction') || tags.includes('post-production')) postProduction += 1
    if (tags.includes('diffuse') || tags.includes('diffusé') || tags.includes('released')) distributed += 1
  }
  const topTags = Array.from(tagMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
  const validated = productionsCompleted
  if (distributed === 0) distributed = productionData.filter((row) => row.status === 'COMPLETED' && row.viewCount > 0).length

  const missingImageCount = filteredProductions.filter((row) => !row.image?.trim()).length
  const missingYoutubeCount = filteredProductions.filter((row) => !row.youtubeUrl?.trim()).length
  const missingRegionCount = filteredProductions.filter((row) => !row.region?.trim() && !row.country?.trim()).length

  const pipeline = {
    draft: productionsDraft,
    shooting: productionsInProduction,
    postProduction,
    validated,
    distributed,
  }

  const artistsByRegionMap = new Map<string, number>()
  for (const artist of filteredArtists) {
    const label = resolveRegion(artist.region, artist.country)
    artistsByRegionMap.set(label, (artistsByRegionMap.get(label) || 0) + 1)
  }
  const partnersByRegionMap = new Map<string, number>()
  for (const partner of filteredPartners) {
    const label = resolveRegion(partner.region, partner.country)
    partnersByRegionMap.set(label, (partnersByRegionMap.get(label) || 0) + 1)
  }
  const productionsByCountryMap = new Map<string, number>()
  for (const row of filteredProductions) {
    const country = row.country?.trim() || 'Global'
    productionsByCountryMap.set(country, (productionsByCountryMap.get(country) || 0) + 1)
  }
  const studioMap = {
    artistsByRegion: Array.from(artistsByRegionMap.entries()).map(([label, value]) => ({ label, value })),
    partnersByRegion: Array.from(partnersByRegionMap.entries()).map(([label, value]) => ({ label, value })),
    productionsByCountry: Array.from(productionsByCountryMap.entries()).map(([label, value]) => ({ label, value })),
  }

  const topCategory = categoryDistribution[0]?.label || 'N/A'
  const highPotentialProduction = viewsTop[0]?.label || 'Aucune production'
  const risingArtist = artistsTop[0]?.label || 'Aucun artiste'
  const riskPartner = filteredPartners.slice().sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))[0]
  const partnerRisk = riskPartner ? `${riskPartner.name} (${Math.round(riskPartner.riskScore || 0)}/100)` : 'Aucun risque identifié'
  const studioPerformanceScore = clamp(45 + monthlyGrowthPct * 0.9 + retentionRate * 0.35 + publicationRate * 0.2, 5, 99)
  const contentHealth = clamp(100 - (missingImageCount * 8 + missingYoutubeCount * 2 + missingRegionCount * 2), 0, 100)

  const studioHealth =
    productionsInProduction > 0 || productionsCompleted > 0
      ? 'Operational'
      : productionsDraft > 0
      ? 'Setup'
      : 'Idle'

  const prevUsers = usersByMonth[previousMonthKey] || 0
  const currUsers = usersByMonth[currentMonthKey] || 0
  const alerts = [
    {
      key: 'missing-media',
      level: missingImageCount > 0 ? 'high' : 'low',
      label: 'Médias manquants',
      value: `${missingImageCount} production(s) sans image`,
      score: missingImageCount * 8,
    },
    {
      key: 'missing-video',
      level: missingYoutubeCount > 0 ? 'medium' : 'low',
      label: 'Vidéos manquantes',
      value: `${missingYoutubeCount} production(s) sans vidéo`,
      score: missingYoutubeCount * 5,
    },
    {
      key: 'drop-rate',
      level: abandonmentRate > 40 ? 'high' : abandonmentRate > 28 ? 'medium' : 'low',
      label: 'Taux d’abandon élevé',
      value: `${abandonmentRate.toFixed(1)}%`,
      score: Math.round(abandonmentRate),
    },
    {
      key: 'draft-backlog',
      level: productionsDraft > productionsCompleted ? 'medium' : 'low',
      label: 'Backlog draft',
      value: `${productionsDraft} draft(s) vs ${productionsCompleted} terminé(s)`,
      score: Math.max(0, productionsDraft - productionsCompleted) * 6,
    },
    {
      key: 'missing-geo',
      level: missingRegionCount > 0 ? 'medium' : 'low',
      label: 'Données géographiques manquantes',
      value: `${missingRegionCount} production(s)`,
      score: missingRegionCount * 4,
    },
  ]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  return {
    counters: {
      productionsTotal,
      productionsDraft,
      productionsInProduction,
      productionsCompleted,
      artistesTotal,
      artistesActive,
      partenairesTotal,
      partenairesActive,
      usersTotal,
      usersNew30d,
    },
    charts: {
      productionGrowthSeries,
      categoryDistribution,
      userGrowthSeries,
      statusOverview,
      viewsSeries,
    },
    executiveOverview: {
      monthlyPublications: {
        value: currentProductions,
        delta: monthlyGrowthPct,
        sparkline: productionGrowthSeries.slice(-6),
      },
      growthRate: {
        value: monthlyGrowthPct,
        delta: monthlyGrowthPct - pctChange(prevProductions, productionByMonth[months[months.length - 3]] || 0),
        sparkline: productionGrowthSeries.slice(-6),
      },
      retentionRate: {
        value: retentionRate,
        delta: retentionRate - 60,
        sparkline: productionGrowthSeries.slice(-6).map((p, index) => ({
          label: p.label,
          value: clamp(retentionRate + (index - 3) * 0.6, 0, 100),
        })),
      },
      averageWatchTime: {
        value: avgWatchTime,
        delta: pctChange(
          watchMinutesByMonth[currentMonthKey] || 0,
          Math.max(1, watchMinutesByMonth[previousMonthKey] || 0),
        ),
        sparkline: months.map((m) => ({ label: monthLabel(m), value: watchMinutesByMonth[m] })),
      },
      activeProductionRate: {
        value: activeProductionRate,
        delta: activeProductionRate - 50,
        sparkline: statusOverview,
      },
      completionRate: {
        value: publicationRate,
        delta: publicationRate - 50,
        sparkline: statusOverview.map((p) => ({ label: p.label, value: p.value })),
      },
    },
    contentPerformance: {
      topByViews: viewsTop,
      topByCompletion: completionTop,
      topArtists: artistsTop,
      averageWatchTimeMinutes: Number(avgWatchTime.toFixed(1)),
      abandonmentRate: Number(abandonmentRate.toFixed(1)),
      topTags,
      missingImageCount,
      missingYoutubeCount,
      missingRegionCount,
      activeFilters: {
        period: `${periodDays}j`,
        scope: query ? `Recherche: ${query}` : 'Global',
      },
    },
    studioMap,
    pipeline,
    studioInsights: {
      highPotentialProduction,
      risingArtist,
      partnerRisk,
      globalPerformanceScore: Number(studioPerformanceScore.toFixed(1)),
      contentHealth: Number(contentHealth.toFixed(1)),
    },
    insights: {
      monthlyGrowthPct,
      latestProduction,
      topCategory,
      studioHealth,
      recentLogs,
      usersGrowthPct: pctChange(currUsers, prevUsers),
    },
    alerts,
  }
}
