import Link from "next/link";

export default function Projects() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6">Projects</h1>
        <p className="text-xl text-gray-500">
          A collection of my work across software engineering, design systems, and spatial computing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Link key={i} href={`/projects/project-${i}`} className="group flex flex-col gap-4">
            <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-primary-900 mb-1 group-hover:underline">Project Title {i}</h2>
              <p className="text-gray-500 text-sm mb-3">Next.js • Tailwind • Supabase</p>
              <p className="text-gray-600">A brief description of the project demonstrating the problems solved and the impact created.</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
