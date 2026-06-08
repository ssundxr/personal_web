import Link from "next/link"
import { createClient } from "../../utils/supabase/server"

interface TimelinePageProps {
  searchParams: Promise<{ category?: string }>
}

export const revalidate = 60 // Cache page for 60 seconds

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const params = await searchParams
  const activeCategory = typeof params.category === 'string' ? params.category : 'all'

  const supabase = await createClient()

  // Fetch timeline events along with related entity titles and slugs
  const { data: rawEvents } = await supabase
    .from('timeline_events')
    .select(`
      *,
      story:story_id(title, slug),
      project:project_id(title, slug),
      research:research_id(title, slug),
      achievement:achievement_id(title)
    `)
    .order('date', { ascending: false })

  const events = rawEvents || []

  // Filter events based on active category
  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => e.category === activeCategory)

  // Extract list of unique years in descending order
  const uniqueYears = Array.from(new Set(events.map(e => e.year))).sort((a, b) => b - a)

  // Filter featured milestones
  const featuredEvents = events
    .filter(e => e.is_featured)
    .sort((a, b) => b.importance_score - a.importance_score)

  const categories = [
    { slug: 'all', label: 'All Milestones' },
    { slug: 'career', label: 'Career' },
    { slug: 'education', label: 'Education' },
    { slug: 'research', label: 'Research' },
    { slug: 'project', label: 'Projects' },
    { slug: 'achievement', label: 'Achievements' },
    { slug: 'travel', label: 'Travel' },
    { slug: 'personal', label: 'Personal' }
  ]

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-primary-900 bg-gray-100 px-3 py-1 rounded-full">
              Ecosystem Spine
            </span>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-primary-900 mt-4">
              Journey Timeline
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl leading-relaxed">
              An interactive chronological log tracking education, career milestones, travel logs, academic publications, and personal stories.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED MILESTONES (Change 1 & 2) */}
      {featuredEvents.length > 0 && (
        <section className="w-full max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Featured Milestones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="relative bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between gap-6 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                {event.cover_image && (
                  <div className="absolute inset-0 bg-cover bg-center opacity-5 group-hover:scale-105 transition-transform duration-700 pointer-events-none" style={{ backgroundImage: `url(${event.cover_image})` }} />
                )}
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span className="font-mono">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="uppercase tracking-widest text-primary-900 bg-gray-100 px-2 py-0.5 rounded-full">{event.category}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 leading-snug group-hover:underline">
                      {event.title}
                    </h3>
                    {event.era && (
                      <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full mt-1.5 inline-block">
                        Era: {event.era}
                      </span>
                    )}
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-2.5 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Event relation CTA link */}
                <div className="border-t border-gray-50 pt-4 mt-2">
                  {event.story && (
                    <Link href={`/archive/${event.story.slug}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      Read Story ↗
                    </Link>
                  )}
                  {event.project && (
                    <Link href={`/projects/${event.project.slug}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      View Project ↗
                    </Link>
                  )}
                  {event.research && (
                    <Link href={`/research/${event.research.slug}`} className="text-xs font-semibold text-blue-600 hover:underline">
                      Read Paper ↗
                    </Link>
                  )}
                  {!event.story && !event.project && !event.research && (
                    <span className="text-xs text-gray-400 italic font-medium">Verified Milestone</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. TIMELINE LAYOUT SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-32 border-t border-gray-100 pt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR: Navigation and Filters */}
          <div className="lg:w-64 shrink-0 flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
            
            {/* Category Filter Badges */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Filter By</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/timeline?category=${cat.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border text-left ${activeCategory === cat.slug ? 'bg-primary-900 border-primary-900 text-white' : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600'}`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Year Sidebar Navigator */}
            {uniqueYears.length > 0 && (
              <div className="hidden lg:block">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Navigate Years</h3>
                <div className="flex flex-col gap-2 border-l border-gray-100 pl-4">
                  {uniqueYears.map((yr) => (
                    <a
                      key={yr}
                      href={`#year-${yr}`}
                      className="text-xs font-mono font-bold text-gray-400 hover:text-gray-900 hover:font-bold transition-all py-1 block"
                    >
                      {yr}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAIN TIMELINE LIST */}
          <div className="flex-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-100 rounded-3xl">
                <span className="text-2xl">🔍</span>
                <p className="text-sm text-gray-400 mt-2 font-medium">No milestones matching the selected category.</p>
              </div>
            ) : (
              <div className="relative border-l border-gray-200 pl-8 ml-4 flex flex-col gap-16">
                
                {filteredEvents.map((event, idx) => {
                  const showYearHeading = idx === 0 || filteredEvents[idx - 1].year !== event.year

                  return (
                    <div key={event.id} className="relative flex flex-col gap-4">
                      {/* Year anchor node */}
                      {showYearHeading && (
                        <div id={`year-${event.year}`} className="absolute -left-12 -top-10 bg-white border border-gray-200 px-3 py-1 rounded-full font-mono text-xs font-bold text-primary-900 shadow-sm z-10">
                          {event.year}
                        </div>
                      )}

                      {/* Spine bullet indicator */}
                      <span className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full border-2 border-primary-900 bg-white shadow-sm flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-primary-900 rounded-full"></span>
                      </span>

                      {/* Timeline Card */}
                      <div className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-400">
                            <span className="font-mono">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200 inline-block"></span>
                            <span className="uppercase text-primary-900 bg-gray-100 px-2 py-0.5 rounded-full">{event.category}</span>
                            {event.era && (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 inline-block"></span>
                                <span className="text-amber-800 font-semibold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                  {event.era}
                                </span>
                              </>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-primary-900 leading-snug">
                            {event.title}
                          </h3>

                          {event.description && (
                            <p className="text-xs text-gray-500 leading-relaxed max-w-xl">
                              {event.description}
                            </p>
                          )}

                          {/* Related Entity link badge */}
                          {(event.story || event.project || event.research) && (
                            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-50">
                              {event.story && (
                                <Link href={`/archive/${event.story.slug}`} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline bg-blue-50/50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                  📚 Read Story: {event.story.title} ↗
                                </Link>
                              )}
                              {event.project && (
                                <Link href={`/projects/${event.project.slug}`} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline bg-blue-50/50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                  💻 View Project: {event.project.title} ↗
                                </Link>
                              )}
                              {event.research && (
                                <Link href={`/research/${event.research.slug}`} className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline bg-blue-50/50 border border-blue-100 px-2.5 py-1 rounded-lg">
                                  🔬 Read Research: {event.research.title} ↗
                                </Link>
                              )}
                            </div>
                          )}
                        </div>

                        {event.cover_image && (
                          <div className="w-full md:w-36 aspect-[16/9] md:aspect-square bg-cover bg-center rounded-xl border border-gray-150" style={{ backgroundImage: `url(${event.cover_image})` }} />
                        )}
                      </div>

                    </div>
                  )
                })}

              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
