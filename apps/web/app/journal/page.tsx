import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | Sunder",
  description: "A centralized hub for the journey of life, photography, maps, and research.",
};

export default function JournalHub() {
  const sections = [
    { name: "Now", path: "/journal/now", desc: "A real-time personal operating system and status dashboard." },
    { name: "Timeline", path: "/journal/timeline", desc: "Chronological log of milestones, events, and personal history." },
    { name: "Global Map", path: "/journal/map", desc: "Interactive atlas tracking coordinates, journeys, and stories." },
    { name: "Visual Archive", path: "/journal/photography", desc: "Museum-grade photography collections and photostream." },
    { name: "Research", path: "/journal/research", desc: "Academic papers, independent research, and whitepapers." },
    { name: "Project Archive", path: "/journal/projects", desc: "A curated collection of past and present builds." },
  ];

  return (
    <div className="flex flex-col w-full min-h-[90vh] px-6 md:px-12 py-32 bg-[#f0efed] relative overflow-hidden">
      <span className="section-number opacity-[0.02] text-[20vw] absolute right-0 top-10 pointer-events-none">01</span>
      
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-[8rem] font-bold tracking-tighter text-[#1a1a1a] leading-none uppercase mb-8">
          The Journal
        </h1>
        <p className="text-xl md:text-3xl text-[#1a1a1a] max-w-3xl leading-snug font-medium tracking-tight mb-24">
          The interconnected digital ecosystem documenting the journey of life, systems, and thoughts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 w-full text-left">
          {sections.map((section, idx) => (
            <Link key={idx} href={section.path} className="group border-t border-[#d1d5db] pt-8 hover:border-[#1a1a1a] transition-colors flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] tracking-tight group-hover:text-[#3b5bdb] transition-colors">{section.name}</h2>
                <span className="font-mono text-xl text-[#999] group-hover:text-[#3b5bdb] group-hover:translate-x-2 transition-all">→</span>
              </div>
              <p className="font-mono text-sm md:text-base text-[#666] leading-relaxed">
                {section.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
