import Link from "next/link"
import { createClient } from "../../utils/supabase/server"

interface TimelinePageProps {
  searchParams: Promise<{ category?: string }>
}

export const revalidate = 60

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const params = await searchParams
  const activeCategory = typeof params.category === 'string' ? params.category : 'all'

  const supabase = await createClient()

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

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => e.category === activeCategory)

  const uniqueYears = Array.from(new Set(events.map(e => e.year))).sort((a, b) => b - a)

  const categories = [
    { slug: 'all', label: 'All' },
    { slug: 'career', label: 'Career' },
    { slug: 'education', label: 'Education' },
    { slug: 'research', label: 'Research' },
    { slug: 'project', label: 'Projects' },
    { slug: 'achievement', label: 'Achievements' },
    { slug: 'travel', label: 'Travel' },
    { slug: 'personal', label: 'Personal' }
  ]

  return (
    <div className="flex flex-col w-full">

      {/* HERO */}
      <section className="section-full py-20 md:py-28">
        <span className="section-number">01</span>
        <div className="section-label">section.timeline</div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a]">Journey Timeline</h1>
        <p className="mt-4 text-base text-[#666] font-mono max-w-2xl leading-relaxed">
          An interactive chronological log tracking education, career milestones, travel, publications, and personal stories.
        </p>
      </section>

      {/* TIMELINE LAYOUT */}
      <section className="section-full pb-32 border-t border-[#d1d5db] pt-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* SIDEBAR */}
          <div className="lg:w-56 shrink-0 flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-4">Filter</h3>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/timeline?category=${cat.slug}`}
                    className={`px-3 py-1.5 font-mono text-xs transition-all border ${
                      activeCategory === cat.slug
                        ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white'
                        : 'bg-white border-[#d1d5db] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {uniqueYears.length > 0 && (
              <div className="hidden lg:block">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-4">Years</h3>
                <div className="flex flex-col gap-1.5 border-l border-[#d1d5db] pl-4">
                  {uniqueYears.map((yr) => (
                    <a key={yr} href={`#year-${yr}`} className="font-mono text-xs text-[#999] hover:text-[#1a1a1a] transition-colors py-0.5">{yr}</a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAIN TIMELINE */}
          <div className="flex-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20 border border-[#d1d5db] bg-white">
                <p className="font-mono text-sm text-[#999]">No milestones matching this category.</p>
              </div>
            ) : (
              <div className="relative border-l border-[#d1d5db] pl-8 ml-3 flex flex-col gap-12">
                {filteredEvents.map((event, idx) => {
                  const showYearHeading = idx === 0 || filteredEvents[idx - 1]?.year !== event.year

                  return (
                    <div key={event.id} className="relative flex flex-col gap-3">
                      {showYearHeading && (
                        <div id={`year-${event.year}`} className="absolute -left-[46px] -top-8 bg-[#f0efed] border border-[#d1d5db] px-2.5 py-1 font-mono text-xs font-bold text-[#1a1a1a] z-10">
                          {event.year}
                        </div>
                      )}

                      {/* Spine node */}
                      <span className="absolute -left-[35px] top-2 w-2.5 h-2.5 border border-[#d1d5db] bg-[#f0efed]" />

                      {/* Card */}
                      <div className="card flex flex-col gap-3 hover:border-[#1a1a1a] transition-colors">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#999]">
                          <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <span className="w-1 h-1 bg-[#d1d5db] inline-block" />
                          <span className="uppercase text-[#1a1a1a] font-semibold">{event.category}</span>
                          {event.era && (
                            <>
                              <span className="w-1 h-1 bg-[#d1d5db] inline-block" />
                              <span className="text-[#3b5bdb] font-semibold">{event.era}</span>
                            </>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[#1a1a1a] leading-snug">{event.title}</h3>

                        {event.description && (
                          <p className="text-xs text-[#666] leading-relaxed max-w-xl">{event.description}</p>
                        )}

                        {(event.story || event.project || event.research) && (
                          <div className="flex flex-wrap gap-3 mt-1 pt-3 border-t border-[#e0e0e0]">
                            {event.story && <Link href={`/archive/${event.story.slug}`} className="case-link text-xs">Read Story</Link>}
                            {event.project && <Link href={`/projects/${event.project.slug}`} className="case-link text-xs">View Project</Link>}
                            {event.research && <Link href={`/research/${event.research.slug}`} className="case-link text-xs">Read Research</Link>}
                          </div>
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
