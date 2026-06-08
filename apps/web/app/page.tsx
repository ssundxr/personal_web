import Link from "next/link";
import Image from "next/image";
import { createClient } from "../utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch visible sections
  const { data: visibleSections } = await supabase
    .from('pos_sections')
    .select('slug, is_visible')
    .eq('is_visible', true);

  const activeSlugs = (visibleSections || []).map((s) => s.slug);

  // Fetch active entries
  const { data: posEntries } = await supabase
    .from('pos_entries')
    .select('*')
    .eq('status', 'active')
    .order('order_index', { ascending: true });

  // Fetch top active research tracker
  const { data: activeResearch } = await supabase
    .from('pos_research_tracker')
    .select('*')
    .neq('status', 'archived')
    .order('updated_at', { ascending: false })
    .limit(1);

  // Fetch featured and recent timeline milestones (Part 9)
  const { data: timelineEvents } = await supabase
    .from('timeline_events')
    .select(`
      id,
      title,
      description,
      category,
      date,
      era,
      is_featured,
      importance_score,
      story:story_id(slug),
      project:project_id(slug),
      research:research_id(slug)
    `)
    .order('date', { ascending: false })
    .limit(3);

  type PosEntry = {
    id: string;
    section_slug: string;
    title: string;
    subtitle: string | null;
    url: string | null;
    progress: number | null;
    updated_at: string;
  };

  const typedEntries = (posEntries || []) as PosEntry[];

  // Group entries
  const entryMap = typedEntries.reduce((acc, entry) => {
    if (!acc[entry.section_slug]) acc[entry.section_slug] = [];
    acc[entry.section_slug]!.push(entry);
    return acc;
  }, {} as Record<string, PosEntry[]>);

  const isVisible = (slug: string) => activeSlugs.includes(slug);

  type TimelineRelation = { slug: string };
  type TimelineEvent = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    date: string;
    era: string | null;
    is_featured: boolean;
    importance_score: number;
    story: TimelineRelation | null;
    project: TimelineRelation | null;
    research: TimelineRelation | null;
  };

  const typedEvents = (timelineEvents || []) as unknown as TimelineEvent[];

  return (
    <div className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-32 md:py-48">
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-primary-900 max-w-4xl leading-tight">
          Designing the future of <br className="hidden md:block"/> human-computer interaction.
        </h1>
        <p className="mt-8 text-xl text-gray-500 max-w-2xl leading-relaxed">
          I am a researcher and builder focusing on spatial computing, artificial intelligence, and digital legacy.
        </p>
        <div className="mt-12 flex gap-4">
          <Link href="/projects" className="px-6 py-3 bg-primary-900 text-white font-medium rounded-full hover:bg-primary-900/90 transition-all">
            View Projects
          </Link>
          <Link href="/archive" className="px-6 py-3 bg-gray-100 text-primary-900 font-medium rounded-full hover:bg-gray-200 transition-all">
            Read Archive
          </Link>
        </div>
      </section>

      {/* PERSONAL OS STATUS CARD (Change 3) */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24 -mt-12 md:-mt-20">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col justify-between gap-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse"></span>
                <span className="text-xs uppercase font-bold tracking-widest text-primary-900">Live Status</span>
              </div>
              <Link href="/now" className="text-xs font-semibold text-primary-900 hover:underline">
                View OS /now →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Focus */}
              {isVisible('focus') && entryMap['focus']?.[0] && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Current Focus</span>
                  <span className="text-gray-900 font-medium">{entryMap['focus'][0].title}</span>
                </div>
              )}

              {/* Building */}
              {isVisible('building') && entryMap['building']?.[0] && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Building</span>
                  <span className="text-gray-900 font-medium">
                    {entryMap['building'][0].url ? (
                      <a href={entryMap['building'][0].url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                        {entryMap['building'][0].title}
                      </a>
                    ) : (
                      entryMap['building'][0].title
                    )}
                  </span>
                </div>
              )}

              {/* Reading */}
              {isVisible('reading') && entryMap['reading']?.[0] && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Reading</span>
                  <span className="text-gray-900 font-medium">
                    {entryMap['reading'][0].title} <span className="text-gray-400">by {entryMap['reading'][0].subtitle}</span>
                  </span>
                </div>
              )}

              {/* Location */}
              {isVisible('location') && entryMap['location']?.[0] && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Location</span>
                  <span className="text-gray-900 font-medium">{entryMap['location'][0].title}</span>
                </div>
              )}

              {/* Stack */}
              {isVisible('stack') && (entryMap['stack'] || []).length > 0 && (
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Core Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {(entryMap['stack'] || []).slice(0, 4).map((tech) => (
                      <span key={tech.id} className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-medium text-gray-700">
                        {tech.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Research */}
              {activeResearch?.[0] && (
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Active Research</span>
                  <span className="text-gray-900 font-medium">
                    {activeResearch[0].title} <span className="text-primary-800 font-semibold">({activeResearch[0].progress}%)</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS BENTO GRID */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-primary-900">Featured Work</h2>
            <p className="mt-2 text-gray-500">Selected projects and experiments.</p>
          </div>
          <Link href="/projects" className="text-sm font-medium text-primary-900 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bento Item 1 - Large */}
          <Link href="/projects/spatial-os" className="group relative block aspect-[4/3] md:col-span-2 overflow-hidden rounded-3xl bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-3xl font-medium text-white mb-2 group-hover:underline">Spatial OS</h3>
              <p className="text-white/80">A new paradigm for spatial computing interfaces.</p>
            </div>
            {/* Image placeholder - normally would use next/image */}
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
          </Link>

          {/* Bento Item 2 */}
          <Link href="/projects/neural-engine" className="group relative block aspect-square overflow-hidden rounded-3xl bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-2xl font-medium text-white mb-2 group-hover:underline">Neural Engine</h3>
              <p className="text-white/80">Local LLM inference optimization.</p>
            </div>
            <div className="absolute inset-0 bg-gray-300 group-hover:scale-105 transition-transform duration-700 ease-out" />
          </Link>

          {/* Bento Item 3 */}
          <Link href="/projects/atlas" className="group relative block aspect-square overflow-hidden rounded-3xl bg-gray-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 p-8 z-20">
              <h3 className="text-2xl font-medium text-white mb-2 group-hover:underline">Atlas Map</h3>
              <p className="text-white/80">Global journey visualization system.</p>
            </div>
            <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
          </Link>
        </div>
      </section>

      {/* JOURNEY TIMELINE PREVIEW (Change 3 / Part 9) */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-medium tracking-tight text-primary-900">Journey Timeline</h2>
            <p className="mt-2 text-gray-500">Key milestones, career pivots, and publications.</p>
          </div>
          <Link href="/timeline" className="text-sm font-medium text-primary-900 hover:underline">
            View full timeline →
          </Link>
        </div>

        <div className="relative border-l border-gray-100 pl-8 ml-4 flex flex-col gap-10">
          {typedEvents.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No timeline events configured yet.</p>
          ) : (
            typedEvents.map((event) => (
              <div key={event.id} className="relative flex flex-col gap-1">
                {/* Spine bullet node */}
                <span className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-primary-900 rounded-full"></span>
                </span>
                
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-400">
                  <span className="font-mono">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-200 inline-block"></span>
                  <span className="uppercase text-primary-900 bg-gray-100 px-2 py-0.5 rounded-full">{event.category}</span>
                  {event.era && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-200 inline-block"></span>
                      <span className="text-amber-800 font-semibold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                        {event.era}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-semibold text-primary-900 mt-1 leading-snug">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-xs text-gray-500 mt-1.5 max-w-xl leading-relaxed">{event.description}</p>
                )}

                {/* Event relation action link */}
                <div className="mt-2.5">
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
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* RESEARCH & PUBLICATIONS */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
        <h2 className="text-3xl font-medium tracking-tight text-primary-900 mb-12">Recent Research</h2>
        <div className="flex flex-col gap-8">
          {[
            { year: "2026", title: "Cognitive Load in Spatial Interfaces", venue: "CHI 2026", link: "/research/1" },
            { year: "2025", title: "Optimizing Edge Inference for On-Device LLMs", venue: "NeurIPS 2025", link: "/research/2" },
            { year: "2024", title: "The Architecture of Digital Memory", venue: "Personal Archive", link: "/research/3" },
          ].map((item, idx) => (
            <Link key={idx} href={item.link} className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-6 px-6 transition-colors rounded-xl">
              <div className="text-gray-400 font-mono text-sm w-16 shrink-0">{item.year}</div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.venue}</p>
              </div>
              <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Read Paper ↗
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
