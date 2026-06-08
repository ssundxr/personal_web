import Link from "next/link";
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

  // Fetch timeline events
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
    <div className="flex flex-col w-full">

      {/* ═══════════ SECTION 01 — HERO ═══════════ */}
      <section className="section-full py-28 md:py-40">
        <span className="section-number">01</span>
        <div className="section-label">section.start</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] max-w-4xl leading-[1.1]">
          Designing the future of<br className="hidden md:block" /> human-computer interaction.
        </h1>
        <p className="mt-8 text-base md:text-lg text-[#666] max-w-2xl leading-relaxed font-mono">
          Researcher and builder focusing on spatial computing, artificial intelligence, and digital legacy.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/projects" className="px-6 py-3 border border-[#1a1a1a] text-[#1a1a1a] font-mono text-sm hover:bg-[#1a1a1a] hover:text-white transition-all">
            View Projects
          </Link>
          <Link href="/now" className="px-6 py-3 border border-[#d1d5db] text-[#666] font-mono text-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all">
            /now
          </Link>
        </div>
      </section>

      {/* ═══════════ SECTION 02 — LIVE STATUS ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">02</span>
        <div className="section-label">section.status</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-8">Live Status</h2>

        <div className="card">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e0e0e0]">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#1a1a1a] font-semibold">Operating System</span>
            <Link href="/now" className="ml-auto font-mono text-xs text-[#3b5bdb] hover:underline">
              View full /now →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isVisible('focus') && entryMap['focus']?.[0] && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Current Focus</span>
                <span className="text-sm text-[#1a1a1a]">{entryMap['focus'][0].title}</span>
              </div>
            )}

            {isVisible('building') && entryMap['building']?.[0] && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Building</span>
                <span className="text-sm text-[#1a1a1a]">
                  {entryMap['building'][0].url ? (
                    <a href={entryMap['building'][0].url} target="_blank" rel="noopener noreferrer" className="hover:text-[#3b5bdb] underline">
                      {entryMap['building'][0].title}
                    </a>
                  ) : (
                    entryMap['building'][0].title
                  )}
                </span>
              </div>
            )}

            {isVisible('reading') && entryMap['reading']?.[0] && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Reading</span>
                <span className="text-sm text-[#1a1a1a]">
                  {entryMap['reading'][0].title} <span className="text-[#999]">by {entryMap['reading'][0].subtitle}</span>
                </span>
              </div>
            )}

            {isVisible('location') && entryMap['location']?.[0] && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Location</span>
                <span className="text-sm text-[#1a1a1a] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  {entryMap['location'][0].title}
                </span>
              </div>
            )}

            {isVisible('stack') && (entryMap['stack'] || []).length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Core Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {(entryMap['stack'] || []).slice(0, 5).map((tech) => (
                    <span key={tech.id} className="tag-pill text-[10px]">
                      {tech.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeResearch?.[0] && (
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#999]">Active Research</span>
                <span className="text-sm text-[#1a1a1a]">
                  {activeResearch[0].title} <span className="text-[#3b5bdb] font-mono text-xs font-semibold">({activeResearch[0].progress}%)</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 03 — WHO I AM ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">03</span>
        <div className="section-label">section.about</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-8">Who I Am</h2>

        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1 max-w-xl">
            <p className="text-lg text-[#444] leading-relaxed">
              I&apos;m a 21-year-old builder and researcher working at the intersection of spatial computing, AI systems, and digital legacy. I believe the best tools are invisible — and the best stories are lived, not told.
            </p>
            <Link href="/now" className="case-link mt-6 inline-flex">
              More about me
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-px bg-[#e0e0e0] border border-[#e0e0e0]">
            <div className="bg-white p-6 flex flex-col items-center justify-center text-center">
              <div><span className="stat-value">21</span></div>
              <div className="stat-label">years old</div>
            </div>
            <div className="bg-white p-6 flex flex-col items-center justify-center text-center">
              <div><span className="stat-value">2</span><span className="stat-suffix">+</span></div>
              <div className="stat-label">internships</div>
            </div>
            <div className="bg-white p-6 flex flex-col items-center justify-center text-center">
              <div><span className="stat-value">4</span><span className="stat-suffix">+</span></div>
              <div className="stat-label">trips & explorations</div>
            </div>
            <div className="bg-white p-6 flex flex-col items-center justify-center text-center">
              <div><span className="stat-value">∞</span></div>
              <div className="stat-label">curiosity</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 04 — FEATURED WORK ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">04</span>
        <div className="section-label">section.work</div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-10">Featured Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { slug: "spatial-os", title: "Spatial OS", role: "Creator & Researcher", year: "2026", desc: "A new paradigm for spatial computing interfaces, rethinking how humans interact with layered digital spaces.", tags: ["Spatial Computing", "HCI", "XR"] },
            { slug: "neural-engine", title: "Neural Engine", role: "Builder", year: "2025", desc: "Local LLM inference optimization — reducing memory bandwidth bottlenecks while preserving zero-shot reasoning.", tags: ["AI", "Systems", "Edge"] },
            { slug: "atlas", title: "Atlas Map", role: "Creator & Developer", year: "2025", desc: "Global journey visualization system plotting life experiences across coordinates and time.", tags: ["Maps", "Data Viz", "Full Stack"] },
          ].map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex flex-col">
              <div className="aspect-[4/3] bg-[#e5e5e5] border border-[#d1d5db] mb-4 overflow-hidden">
                <div className="w-full h-full bg-[#ddd] group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-[#3b5bdb] font-semibold">{project.year}</span>
                <span className="font-mono text-[10px] text-[#999]">{project.role}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:underline">{project.title}</h3>
              <p className="text-sm text-[#666] leading-relaxed mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                ))}
              </div>
              <span className="case-link text-sm">View case study</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 05 — TIMELINE ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">05</span>
        <div className="section-label">section.timeline</div>
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Journey Timeline</h2>
          <Link href="/timeline" className="case-link text-sm">Full timeline</Link>
        </div>

        <div className="relative border-l border-[#d1d5db] pl-8 ml-4 flex flex-col gap-10">
          {typedEvents.length === 0 ? (
            <p className="font-mono text-xs text-[#999]">No timeline events configured yet.</p>
          ) : (
            typedEvents.map((event) => (
              <div key={event.id} className="relative flex flex-col gap-1.5">
                <span className="absolute -left-[38px] top-1.5 w-3 h-3 border border-[#d1d5db] bg-[#f0efed]" />

                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] text-[#999]">
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="w-1 h-1 bg-[#d1d5db] inline-block" />
                  <span className="uppercase text-[#1a1a1a] font-semibold">{event.category}</span>
                </div>

                <h3 className="text-base font-semibold text-[#1a1a1a] leading-snug">{event.title}</h3>
                {event.description && (
                  <p className="text-xs text-[#666] max-w-xl leading-relaxed">{event.description}</p>
                )}

                <div className="mt-1">
                  {event.story && (
                    <Link href={`/archive/${event.story.slug}`} className="case-link text-xs">Read Story</Link>
                  )}
                  {event.project && (
                    <Link href={`/projects/${event.project.slug}`} className="case-link text-xs">View Project</Link>
                  )}
                  {event.research && (
                    <Link href={`/research/${event.research.slug}`} className="case-link text-xs">Read Paper</Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ═══════════ SECTION 06 — LATEST RESEARCH ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">06</span>
        <div className="section-label">section.research</div>
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a]">Latest Research</h2>
          <Link href="/research" className="case-link text-sm">All research</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { year: "2026", title: "Cognitive Load in Spatial Interfaces", venue: "CHI 2026", tags: ["HCI", "Spatial", "Cognition"] },
            { year: "2025", title: "Optimizing Edge Inference for On-Device LLMs", venue: "NeurIPS 2025", tags: ["AI", "Systems", "Edge"] },
          ].map((item, idx) => (
            <div key={idx} className="card flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[#3b5bdb] font-semibold">{item.year}</span>
                <span className="font-mono text-[10px] text-[#999]">{item.venue}</span>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a] leading-snug">{item.title}</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                ))}
              </div>
              <span className="case-link text-sm mt-auto">Read more</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ SECTION 07 — LET'S TALK ═══════════ */}
      <section className="section-full py-20 border-t border-[#d1d5db]">
        <span className="section-number">07</span>
        <div className="text-center py-16">
          <div className="text-3xl text-[#3b5bdb] mb-4">✦</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">Let&apos;s Connect</h2>
          <p className="font-mono text-sm text-[#999] max-w-md mx-auto mb-8">
            Always open to interesting conversations about technology, research, and building things that matter.
          </p>
          <a
            href="mailto:hello@sunder.dev"
            className="px-8 py-3 bg-[#3b5bdb] text-white font-mono text-sm hover:bg-[#2b4bcb] transition-colors inline-block"
          >
            reach out
          </a>
        </div>
      </section>

    </div>
  );
}
