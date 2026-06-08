import Link from "next/link";
import { createClient } from "../../utils/supabase/server";

export const revalidate = 0;

export default async function StoriesManager() {
  const supabase = await createClient();
  const { data: stories } = await supabase.from('stories').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Stories</h1>
        <Link href="/stories/new" className="px-4 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
          Create Story
        </Link>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!stories || stories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No stories found. Create your first one!
                </td>
              </tr>
            ) : (
              stories.map((story) => (
                <tr key={story.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{story.title}</div>
                    <div className="text-sm text-gray-500">/archive/{story.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {story.is_published ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Published</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(story.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/stories/${story.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
