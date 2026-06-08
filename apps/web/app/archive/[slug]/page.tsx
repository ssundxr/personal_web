import Link from "next/link";

export default function StoryDetail({ params }: { params: { slug: string } }) {
  return (
    <article className="w-full max-w-3xl mx-auto px-6 py-24">
      <Link href="/archive" className="text-sm font-medium text-gray-500 hover:text-primary-900 mb-12 inline-block">
        ← Back to Archive
      </Link>
      
      <header className="mb-16">
        <p className="text-sm font-mono text-gray-400 mb-4">OCTOBER 14, 2026</p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6 leading-tight">
          Building a Personal Operating System
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed">
          An exploration into how I use software to manage my digital legacy, personal knowledge base, and daily workflows.
        </p>
      </header>

      <div className="prose prose-lg prose-gray max-w-none">
        <p>
          This is a placeholder for the story content. In a production environment, this content will be loaded from Supabase and rendered using a custom MDX component parser.
        </p>
        <h2>The Architecture of Memory</h2>
        <p>
          We generate terabytes of data across our lifetime, but very little of it is curated or preserved in a meaningful way. I wanted to build a system that acts as a digital garden...
        </p>
        <blockquote>
          "Your digital legacy shouldn't be trapped in isolated SaaS platforms. It should be a living, breathing ecosystem."
        </blockquote>
        <p>
          To solve this, I designed a monolithic personal operating system using Next.js, Postgres, and MDX.
        </p>
      </div>
    </article>
  );
}
