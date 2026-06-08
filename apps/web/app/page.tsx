import Link from "next/link";
import Image from "next/image";

export default function Home() {
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
