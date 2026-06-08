import Link from "next/link"
import { createClient } from "../../utils/supabase/server"

export const revalidate = 60 // Cache page for up to 60 seconds on public CDN

export default async function NowPage() {
  const supabase = await createClient()

  // Fetch only visible sections
  const { data: visibleSections } = await supabase
    .from('pos_sections')
    .select('slug, title')
    .eq('is_visible', true)

  const activeSlugs = (visibleSections || []).map((s) => s.slug)

  // Fetch active shelf and vitals entries
  const { data: entries } = await supabase
    .from('pos_entries')
    .select('*')
    .eq('status', 'active')
    .order('order_index', { ascending: true })

  // Fetch active research tracker items
  const { data: researchTrackers } = await supabase
    .from('pos_research_tracker')
    .select(`
      id,
      title,
      description,
      status,
      progress,
      target_date,
      related_research_id,
      updated_at
    `)
    .order('updated_at', { ascending: false })

  // Fetch goals
  const { data: goals } = await supabase
    .from('pos_goals')
    .select('*')
    .order('quarter', { ascending: false })
    .order('created_at', { ascending: true })

  // Fetch achievements
  const { data: achievements } = await supabase
    .from('pos_achievements')
    .select('*')
    .order('date', { ascending: false })

  // Fetch recent activity feed
  const { data: activities } = await supabase
    .from('pos_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(12)

  // Group entries by section_slug
  const entryMap = (entries || []).reduce((acc, entry) => {
    if (!acc[entry.section_slug]) acc[entry.section_slug] = []
    acc[entry.section_slug].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  const isSectionVisible = (slug: string) => activeSlugs.includes(slug)

  const getVitalText = (slug: string) => {
    if (!isSectionVisible(slug)) return null
    const list = entryMap[slug] || []
    return list[0]?.title || null
  }

  // Format relative date
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    return `${diffDays} days ago`
  }

  // Find last updated timestamp across all POS feeds
  const getLastUpdated = () => {
    let maxTime = 0
    const checkTime = (timeStr?: string | null) => {
      if (!timeStr) return
      const t = new Date(timeStr).getTime()
      if (t > maxTime) maxTime = t
    }

    (entries || []).forEach((e) => checkTime(e.updated_at));
    (researchTrackers || []).forEach((r) => checkTime(r.updated_at));
    (goals || []).forEach((g) => checkTime(g.updated_at));
    (activities || []).forEach((a) => checkTime(a.timestamp));

    if (maxTime === 0) return 'Recent'
    return new Date(maxTime).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Group stack elements by subtitle category
  const stackItems = entryMap['stack'] || []
  const groupedStack = stackItems.reduce((acc, item) => {
    const cat = item.subtitle || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, typeof stackItems>)

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Page Header */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-900 bg-gray-100 px-3 py-1 rounded-full">
              Personal OS
            </span>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-primary-900 mt-4">
              /now
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-xl leading-relaxed">
              A real-time dashboard tracking my active focus, development stack, ongoing research, and current lifestyle stats.
            </p>
          </div>
          <div className="text-xs text-gray-400 font-mono text-left md:text-right shrink-0">
            Last Updated <br/>
            <span className="text-gray-900 font-semibold">{getLastUpdated()}</span>
          </div>
        </div>
      </section>

      {/* Grid Bento Layout */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento 1: Mission & Focus */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl flex flex-col gap-6 shadow-sm">
            {isSectionVisible('mission') && getVitalText('mission') && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current Mission</h3>
                <p className="text-2xl font-normal text-primary-900 leading-snug">
                  "{getVitalText('mission')}"
                </p>
              </div>
            )}

            {isSectionVisible('focus') && getVitalText('focus') && (
              <div className="border-t border-gray-50 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Day-to-Day Focus</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {getVitalText('focus')}
                </p>
              </div>
            )}
          </div>

          {/* Bento 2: Location & Travel Card */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl flex flex-col justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Coordinates & Vitals</h3>
              
              {isSectionVisible('location') && getVitalText('location') && (
                <div className="mb-4">
                  <span className="text-xs text-gray-400">Current Base</span>
                  <div className="text-lg font-medium text-primary-900 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
                    {getVitalText('location')}
                  </div>
                </div>
              )}

              {isSectionVisible('travel') && getVitalText('travel') && (
                <div>
                  <span className="text-xs text-gray-400">Status</span>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{getVitalText('travel')}</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Timezone</span>
              <span className="text-gray-900 font-mono font-medium">GMT+5:30</span>
            </div>
          </div>

          {/* Bento 3: Tech Stack Badge Cloud */}
          {isSectionVisible('stack') && Object.keys(groupedStack).length > 0 && (
            <div className="lg:col-span-2 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Current Tech Stack</h3>
              <div className="flex flex-col gap-5">
                {Object.entries(groupedStack).map(([category, items]) => (
                  <div key={category} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                    <span className="text-xs font-semibold text-gray-400 w-32 shrink-0 md:pt-1">{category}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((tech) => (
                        <span key={tech.id} className="px-3 py-1 text-xs font-medium bg-gray-50 border border-gray-100 hover:border-gray-200 text-gray-800 rounded-full transition-colors">
                          {tech.title}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bento 4: Research Tracker */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Active Research</h3>
            
            <div className="flex flex-col gap-5">
              {(researchTrackers || []).length === 0 ? (
                <p className="text-sm text-gray-400 italic">No research currently tracked.</p>
              ) : (
                (researchTrackers || []).slice(0, 3).map((research) => (
                  <div key={research.id} className="flex flex-col gap-2 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-sm text-primary-900 leading-tight">
                        {research.title}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50/50 border border-blue-100 text-blue-700 shrink-0">
                        {research.status.replace('-', ' ')}
                      </span>
                    </div>
                    {research.description && (
                      <p className="text-xs text-gray-500 leading-normal">{research.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary-900 h-1 rounded-full" style={{ width: `${research.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono w-8 text-right font-medium">{research.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bento 5: Dynamic Shelves (Building / Learning / Reading / Listening) */}
          {['building', 'learning', 'reading', 'listening'].map((slug) => {
            if (!isSectionVisible(slug)) return null
            const items = entryMap[slug] || []
            const label = slug === 'building' ? 'Building' : slug === 'learning' ? 'Learning' : slug === 'reading' ? 'Reading' : 'Listening'
            const labelSub = slug === 'building' ? 'Active developments' : slug === 'learning' ? 'Courses & languages' : slug === 'reading' ? 'Shelf stack' : 'Audio stream'

            return (
              <div key={slug} className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">{labelSub}</p>
                </div>

                <div className="flex flex-col gap-4">
                  {items.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Shelf is currently empty.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex flex-col gap-1">
                        <div className="flex justify-between items-start gap-2 text-xs">
                          <span className="font-medium text-primary-900 leading-tight">
                            {item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-600">
                                {item.title}
                              </a>
                            ) : (
                              item.title
                            )}
                          </span>
                          {item.subtitle && <span className="text-gray-400 text-[10px] text-right">{item.subtitle}</span>}
                        </div>
                        {item.progress !== null && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-primary-950 h-1 rounded-full" style={{ width: `${item.progress}%` }}></div>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono w-8 text-right">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}

          {/* Bento 6: Goals Dashboard */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Quarterly Goals</h3>
            
            <div className="flex flex-col gap-4">
              {(goals || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No targets set for this period.</p>
              ) : (
                (goals || []).slice(0, 4).map((goal) => (
                  <div key={goal.id} className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-primary-900 leading-tight">{goal.title}</span>
                      <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider shrink-0">{goal.quarter}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary-900 h-1 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono w-8 text-right">{goal.progress}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bento 7: Activity Feed */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Activity Log</h3>
            
            <div className="flex flex-col gap-4">
              {(activities || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No recent log actions recorded.</p>
              ) : (
                (activities || []).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 text-xs pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                    <span className="text-[10px] text-gray-400 font-mono shrink-0 pt-0.5 w-16">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-relaxed">
                        {activity.content}
                      </p>
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full shrink-0">
                      {activity.activity_type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bento 8: Achievements */}
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm flex flex-col gap-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Key Milestones</h3>
            
            <div className="flex flex-col gap-4">
              {(achievements || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No major milestones logged.</p>
              ) : (
                (achievements || []).slice(0, 5).map((ach) => (
                  <div key={ach.id} className="flex items-start gap-3 text-xs">
                    <div className="text-lg pt-0.5 shrink-0">🏆</div>
                    <div>
                      <span className="font-medium text-primary-900 block leading-tight">{ach.title}</span>
                      {ach.description && <p className="text-gray-500 text-[10px] mt-0.5 leading-normal">{ach.description}</p>}
                      <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                        {new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
