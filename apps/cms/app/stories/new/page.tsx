import Link from "next/link";
import { createStory } from "../actions";
import { createClient } from "../../../utils/supabase/server";
import SubmitButton from "../../components/SubmitButton";

export default async function NewStory() {
  const supabase = await createClient();
  const { data: locations } = await supabase
    .from('locations')
    .select('id, name, city, country')
    .order('name');

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/stories" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Stories
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">New Story</h1>
        </div>
      </div>
      
      <form action={createStory} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
            <input 
              id="title" 
              name="title" 
              type="text" 
              required 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              placeholder="e.g. Building a Personal OS"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700">Slug</label>
            <input 
              id="slug" 
              name="slug" 
              type="text" 
              required 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-gray-900 bg-white"
              placeholder="e.g. building-personal-os"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="location_id" className="text-sm font-medium text-gray-700">
            📍 Link to Map Pin <span className="text-gray-400 font-normal text-xs">(optional — links this story to a location on the map)</span>
          </label>
          <select 
            id="location_id"
            name="location_id" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          >
            <option value="">— No location —</option>
            {(locations || []).map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.city ? `${loc.city}, ` : ''}{loc.country})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="content_mdx" className="text-sm font-medium text-gray-700">Content (Markdown)</label>
          <textarea 
            id="content_mdx" 
            name="content_mdx" 
            required 
            rows={20}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-sm text-gray-900 bg-white"
            placeholder="Write your story here in Markdown..."
          />
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="is_published" 
            name="is_published" 
            className="w-4 h-4 text-primary-900 rounded border-gray-300 focus:ring-primary-900"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Publish immediately</label>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
          <Link
            href="/stories"
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <SubmitButton className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
            Create Story
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
