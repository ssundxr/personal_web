import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export default async function Archive() {
  const supabase = await createClient();
  
  // Fetch published stories from Supabase
  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary-900 mb-6">Archive</h1>
        <p className="text-xl text-gray-500">
          A digital garden of thoughts, essays, and stories spanning several years.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {error || !stories?.length ? (
          <p className="text-gray-500">No stories found. Create one in the CMS to get started.</p>
        ) : (
          stories.map((story) => (
            <Link key={story.id} href={`/archive/${story.slug}`} className="group flex flex-col gap-4">
              <div className="aspect-[3/4] rounded-2xl bg-gray-100 overflow-hidden relative">
                {/* Normally we'd render the cover_photo here */}
                <div className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-mono mb-2">
                  {new Date(story.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}
                </p>
                <h2 className="text-lg font-medium text-primary-900 mb-2 group-hover:underline leading-snug">
                  {story.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {/* Since content is MDX, we might want to store an excerpt, but for now just showing a placeholder */}
                  Click to read more...
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
