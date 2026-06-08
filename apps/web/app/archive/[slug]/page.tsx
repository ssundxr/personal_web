import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../utils/supabase/server";

export default async function StoryDetail({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: story, error } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !story || !story.is_published) {
    notFound();
  }

  return (
    <article className="w-full max-w-3xl mx-auto px-6 py-24">
      <Link href="/archive" className="text-sm font-medium text-gray-500 hover:text-primary-900 mb-12 inline-block">
        ← Back to Archive
      </Link>
      
      <header className="mb-16">
        <p className="text-sm font-mono text-gray-400 mb-4">
          {new Date(story.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }).toUpperCase()}
        </p>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6 leading-tight">
          {story.title}
        </h1>
      </header>

      <div className="prose prose-lg prose-gray max-w-none">
        {/* For a true MDX implementation, we would pass story.content_mdx into a parser like next-mdx-remote */}
        {/* For V1 simplicity without setting up the full MDX compiler, we render it as text/html if safe, or just render paragraphs */}
        <div className="whitespace-pre-wrap">{story.content_mdx}</div>
      </div>
    </article>
  );
}
