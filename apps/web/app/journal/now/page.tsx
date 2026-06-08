import Link from "next/link"
import { createClient } from "../../../utils/supabase/server"

export const revalidate = 60

export default async function NowPage() {
  const supabase = await createClient()

  const { data: visibleSections } = await supabase
    .from('pos_sections')
    .select('slug, title')
    .eq('is_visible', true)

  const activeSlugs = (visibleSections || []).map((s: any) => s.slug)

  const { data: entries } = await supabase
    .from('pos_entries')
    .select('*')
    .eq('status', 'active')
    .order('order_index', { ascending: true })

  const { data: researchTrackers } = await supabase
    .from('pos_research_tracker')
    .select('id, title, description, status, progress, target_date, related_research_id, updated_at')
    .order('updated_at', { ascending: false })

  const { data: goals } = await supabase
    .from('pos_goals')
    .select('*')
    .order('quarter', { ascending: false })
    .order('created_at', { ascending: true })

  const { data: achievements } = await supabase
    .from('pos_achievements')
    .select('*')
    .order('date', { ascending: false })

  const { data: activities } = await supabase
    .from('pos_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(12)

  type PosEntry = {
    id: string; section_slug: string; title: string; subtitle: string | null;
    url: string | null; progress: number | null; updated_at: string;
  }

  const typedEntries = (entries || []) as PosEntry[]
  const entryMap = typedEntries.reduce((acc, entry) => {
    if (!acc[entry.section_slug]) acc[entry.section_slug] = []
    acc[entry.section_slug]!.push(entry)
    return acc
  }, {} as Record<string, PosEntry[]>)

  const isSectionVisible = (slug: string) => activeSlugs.includes(slug)
  const getVitalText = (slug: string) => {
    if (!isSectionVisible(slug)) return null
    const list = entryMap[slug] || []
    return list[0]?.title || null
  }

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'yesterday'
    return `${diffDays}d ago`
  }

  const getLastUpdated = () => {
    let maxTime = 0
    const check = (t?: string | null) => { if (t) { const v = new Date(t).getTime(); if (v > maxTime) maxTime = v; } };
    (entries || []).forEach((e: any) => check(e.updated_at));
    (researchTrackers || []).forEach((r: any) => check(r.updated_at));
    (goals || []).forEach((g: any) => check(g.updated_at));
    (activities || []).forEach((a: any) => check(a.timestamp));
    if (maxTime === 0) return 'Recent'
    return new Date(maxTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const stackItems = entryMap['stack'] || []
  const groupedStack = stackItems.reduce((acc: Record<string, PosEntry[]>, item: PosEntry) => {
    const cat = item.subtitle || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(item)
    return acc
  }, {} as Record<string, PosEntry[]>)

  return (
    <div className="flex flex-col w-full">

      {/* HEADER */}
      <section className="section-full py-20 md:py-28">
        <span className="section-number">01</span>
        <div className="section-label">section.operating_system</div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">/now</h1>
        <p className="mt-4 text-base text-[#666] font-mono max-w-xl leading-relaxed">
          A real-time dashboard tracking my active focus, development stack, ongoing research, and current vitals.
        </p>
        <div className="mt-4 font-mono text-[10px] text-[#999]">
          Last synced: <span className="text-[#1a1a1a] font-semibold">{getLastUpdated()}</span>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="section-full pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#d1d5db]">

          {/* Mission & Focus */}
          <div className="lg:col-span-2 card flex flex-col gap-6">
            {isSectionVisible('mission') && getVitalText('mission') && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-2">Current Mission</h3>
                <p className="text-xl text-[#1a1a1a] leading-snug">&ldquo;{getVitalText('mission')}&rdquo;</p>
              </div>
            )}
            {isSectionVisible('focus') && getVitalText('focus') && (
              <div className="border-t border-[#e0e0e0] pt-4">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-2">Day-to-Day Focus</h3>
                <p className="text-sm text-[#444] leading-relaxed">{getVitalText('focus')}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="card flex flex-col justify-between gap-6">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-4">Coordinates</h3>
              {isSectionVisible('location') && getVitalText('location') && (
                <div className="mb-4">
                  <span className="font-mono text-[10px] text-[#999]">Current Base</span>
                  <div className="text-lg font-semibold text-[#1a1a1a] flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                    {getVitalText('location')}
                  </div>
                </div>
              )}
              {isSectionVisible('travel') && getVitalText('travel') && (
                <div>
                  <span className="font-mono text-[10px] text-[#999]">Status</span>
                  <p className="text-sm text-[#444] mt-0.5">{getVitalText('travel')}</p>
                </div>
              )}
            </div>
            <div className="border-t border-[#e0e0e0] pt-3 flex justify-between items-center font-mono text-[10px] text-[#999]">
              <span>Timezone</span>
              <span className="text-[#1a1a1a] font-semibold">GMT+5:30</span>
            </div>
          </div>

          {/* Tech Stack */}
          {isSectionVisible('stack') && Object.keys(groupedStack).length > 0 && (
            <div className="lg:col-span-2 card">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-6">Current Tech Stack</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(groupedStack).map(([category, items]) => (
                  <div key={category} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                    <span className="font-mono text-[10px] text-[#999] w-28 shrink-0 md:pt-0.5">{category}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((tech) => (
                        <span key={tech.id} className="tag-pill text-[10px]">{tech.title}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research Tracker */}
          <div className="card flex flex-col gap-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999]">Active Research</h3>
            {(researchTrackers || []).length === 0 ? (
              <p className="font-mono text-xs text-[#999]">No research currently tracked.</p>
            ) : (
              (researchTrackers || []).slice(0, 3).map((r: any) => (
                <div key={r.id} className="flex flex-col gap-2 pb-4 border-b border-[#e0e0e0] last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-semibold text-[#1a1a1a] leading-tight">{r.title}</span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#3b5bdb] font-semibold shrink-0">
                      {r.status.replace('-', ' ')}
                    </span>
                  </div>
                  {r.description && <p className="text-xs text-[#666] leading-normal">{r.description}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${r.progress}%` }} /></div>
                    <span className="font-mono text-[10px] text-[#999] w-8 text-right">{r.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Shelves */}
          {['building', 'learning', 'reading', 'listening'].map((slug) => {
            if (!isSectionVisible(slug)) return null
            const items = entryMap[slug] || []
            const label = slug.charAt(0).toUpperCase() + slug.slice(1)
            return (
              <div key={slug} className="card flex flex-col gap-5">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999]">{label}</h3>
                {items.length === 0 ? (
                  <p className="font-mono text-xs text-[#999]">Shelf is currently empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-2 text-xs">
                        <span className="font-medium text-[#1a1a1a] leading-tight">
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] underline">{item.title}</a>
                          ) : item.title}
                        </span>
                        {item.subtitle && <span className="font-mono text-[10px] text-[#999] text-right">{item.subtitle}</span>}
                      </div>
                      {item.progress !== null && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${item.progress}%` }} /></div>
                          <span className="font-mono text-[10px] text-[#999] w-8 text-right">{item.progress}%</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )
          })}

          {/* Goals */}
          <div className="card flex flex-col gap-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999]">Quarterly Goals</h3>
            {(goals || []).length === 0 ? (
              <p className="font-mono text-xs text-[#999]">No targets set.</p>
            ) : (
              (goals || []).slice(0, 4).map((goal: any) => (
                <div key={goal.id} className="flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-[#1a1a1a] leading-tight">{goal.title}</span>
                    <span className="font-mono text-[9px] uppercase text-[#999] shrink-0">{goal.quarter}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="progress-track flex-1"><div className="progress-fill" style={{ width: `${goal.progress}%` }} /></div>
                    <span className="font-mono text-[10px] text-[#999] w-8 text-right">{goal.progress}%</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-2 card flex flex-col gap-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999]">Activity Log</h3>
            {(activities || []).length === 0 ? (
              <p className="font-mono text-xs text-[#999]">No recent activity.</p>
            ) : (
              (activities || []).map((act: any) => (
                <div key={act.id} className="flex items-start gap-4 text-xs pb-3 border-b border-[#e0e0e0] last:border-0 last:pb-0">
                  <span className="font-mono text-[10px] text-[#999] shrink-0 pt-0.5 w-14">{formatTimeAgo(act.timestamp)}</span>
                  <p className="flex-1 text-[#444] leading-relaxed">{act.content}</p>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#999] border border-[#d1d5db] px-2 py-0.5 shrink-0">{act.activity_type}</span>
                </div>
              ))
            )}
          </div>

          {/* Achievements */}
          <div className="card flex flex-col gap-5">
            <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999]">Key Milestones</h3>
            {(achievements || []).length === 0 ? (
              <p className="font-mono text-xs text-[#999]">No milestones logged.</p>
            ) : (
              (achievements || []).slice(0, 5).map((ach: any) => (
                <div key={ach.id} className="flex items-start gap-3 text-xs">
                  <div className="text-base pt-0.5 shrink-0">◆</div>
                  <div>
                    <span className="font-medium text-[#1a1a1a] block leading-tight">{ach.title}</span>
                    {ach.description && <p className="text-[#666] text-[10px] mt-0.5">{ach.description}</p>}
                    <span className="font-mono text-[9px] text-[#999] mt-1 block">
                      {new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>
    </div>
  )
}
