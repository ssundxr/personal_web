import Link from "next/link";

export default function Archive() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6">Archive</h1>
        <p className="text-xl text-gray-500">
          A digital garden of thoughts, essays, and stories spanning several years.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Link key={i} href={`/archive/story-${i}`} className="group flex flex-col gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-mono mb-2">OCT 14, 2026</p>
              <h2 className="text-lg font-medium text-primary-900 mb-2 group-hover:underline leading-snug">
                Building a Personal Operating System
              </h2>
              <p className="text-gray-600 text-sm line-clamp-2">
                An exploration into how I use software to manage my digital legacy, personal knowledge base, and daily workflows.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
