import Link from "next/link";
import { createProject } from "../../actions";
import { createClient } from "../../../../utils/supabase/server";

export default async function NewProject() {
  const supabase = await createClient();
  const { data: locations } = await supabase.from('locations').select('id, name, city, country').order('name');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">New Project</h1>
        <Link
          href="/projects"
          className="text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <form action={createProject} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" id="title" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input type="text" id="slug" name="slug" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea id="description" name="description" rows={3} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>

          <div>
            <label htmlFor="content_mdx" className="block text-sm font-medium text-gray-700 mb-2">MDX Content</label>
            <textarea id="content_mdx" name="content_mdx" rows={12} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">Live URL (optional)</label>
              <input type="url" id="url" name="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-2">GitHub URL (optional)</label>
              <input type="url" id="github_url" name="github_url" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-2">Linked Location (Map Pin)</label>
            <select id="location_id" name="location_id" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option value="">-- No Location Linked --</option>
              {locations?.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.city ? `(${loc.city}, ${loc.country})` : `(${loc.country})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="is_published" name="is_published" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Publish immediately</label>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
