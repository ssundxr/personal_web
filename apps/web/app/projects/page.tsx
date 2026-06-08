import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Sunder",
  description: "A collection of work across software engineering, spatial computing, and systems design.",
};

export default function Projects() {
  const projects = [
    { slug: "spatial-os", title: "Spatial OS", role: "Creator & Researcher", year: "2026", desc: "A new paradigm for spatial computing interfaces, rethinking how humans interact with layered digital spaces.", tags: ["Spatial Computing", "HCI", "XR"] },
    { slug: "neural-engine", title: "Neural Engine", role: "Builder", year: "2025", desc: "Local LLM inference optimization — reducing memory bandwidth bottlenecks while preserving zero-shot reasoning capabilities.", tags: ["AI", "Systems", "Edge"] },
    { slug: "atlas", title: "Atlas Map", role: "Creator & Developer", year: "2025", desc: "Global journey visualization system plotting life experiences across coordinates and time.", tags: ["Maps", "Data Viz", "Full Stack"] },
    { slug: "personal-web", title: "Personal Ecosystem", role: "Architect", year: "2026", desc: "This very site — a monorepo-driven personal brand ecosystem with CMS, timeline, photography, maps, and discovery platform.", tags: ["Next.js", "Supabase", "Turborepo"] },
  ];

  return (
    <div className="flex flex-col w-full">
      <section className="section-full py-20 md:py-28">
        <span className="section-number">01</span>
        <div className="section-label">section.projects</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-4">
          Featured Work
        </h1>
        <p className="text-base text-[#666] font-mono max-w-xl mb-16">
          A collection of my work across software engineering, design systems, and spatial computing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="group flex flex-col">
              <div className="aspect-[4/3] bg-[#e5e5e5] border border-[#d1d5db] mb-4 overflow-hidden">
                <div className="w-full h-full bg-[#ddd] group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-[#3b5bdb] font-semibold">{project.year}</span>
                <span className="font-mono text-[10px] text-[#999]">{project.role}</span>
              </div>
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-2 group-hover:underline">{project.title}</h2>
              <p className="text-sm text-[#666] leading-relaxed mb-4">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                ))}
              </div>
              <span className="case-link text-sm mt-auto">View case study</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
