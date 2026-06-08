import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | Sunder",
  description: "Academic publications, whitepapers, and independent research.",
};

export default function Research() {
  const papers = [
    { year: "2026", title: "Cognitive Load in Spatial Interfaces", venue: "CHI 2026", month: "May 2026", abstract: "We present a novel framework for measuring cognitive load in multi-layered spatial computing environments, demonstrating a 35% reduction in task-switching overhead.", tags: ["HCI", "Spatial", "Cognition"] },
    { year: "2025", title: "Optimizing Edge Inference for On-Device LLMs", venue: "NeurIPS 2025", month: "December 2025", abstract: "A novel architecture for local LLM inference that reduces memory bandwidth bottlenecks by 40% while preserving zero-shot reasoning capabilities.", tags: ["AI", "Systems", "Edge"] },
    { year: "2024", title: "The Architecture of Digital Memory", venue: "Personal Archive", month: "August 2024", abstract: "An exploration of how humans construct meaning from digital artifacts — examining the intersection of personal archiving, identity, and temporal perception.", tags: ["Digital Legacy", "Archiving", "Identity"] },
  ];

  return (
    <div className="flex flex-col w-full">
      <section className="section-full py-20 md:py-28">
        <span className="section-number">01</span>
        <div className="section-label">section.research</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-4">
          Research & Publications
        </h1>
        <p className="text-base text-[#666] font-mono max-w-xl mb-16">
          Academic publications, whitepapers, and independent research on human-computer interaction.
        </p>

        <div className="flex flex-col gap-0">
          {papers.map((paper, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-12 py-8 border-b border-[#d1d5db] first:border-t first:border-[#d1d5db]">
              <div className="w-40 shrink-0">
                <span className="font-mono text-[10px] text-[#3b5bdb] font-semibold block">{paper.venue}</span>
                <span className="font-mono text-[10px] text-[#999] block mt-1">{paper.month}</span>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h2 className="text-xl font-bold text-[#1a1a1a] leading-snug">{paper.title}</h2>
                <p className="text-sm text-[#666] leading-relaxed max-w-2xl">{paper.abstract}</p>
                <div className="flex flex-wrap gap-2">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="tag-pill text-[10px]">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  <span className="case-link text-sm">Read more</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
