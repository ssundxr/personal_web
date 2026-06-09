import Link from "next/link";
import { updateResearch, deleteResearch } from "../actions";
import { createAdminClient } from "../../../utils/supabase/admin";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';


export default async function EditResearch({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  
  const [{ data: paper }, { data: locations }] = await Promise.all([
    supabase.from("research").select("*").eq("id", id).single(),
    supabase.from('locations').select('id, name, city, country').order('name')
  ]);

  if (!paper) {
    notFound();
  }

  const deleteAction = deleteResearch.bind(null, paper.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Edit Paper</h1>
        <div className="flex gap-4">
          <form action={deleteAction}>
            <button type="submit" className="text-red-500 hover:text-red-700 font-medium px-4 py-2 border border-transparent">
              Delete
            </button>
          </form>
          <Link
            href="/research"
            className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <form action={updateResearch} className="space-y-6">
          <input type="hidden" name="id" value={paper.id} />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" id="title" name="title" defaultValue={paper.title} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
            
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input type="text" id="slug" name="slug" defaultValue={paper.slug} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
            </div>
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">Abstract / Summary</label>
            <textarea id="abstract" name="abstract" defaultValue={paper.abstract} rows={4} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>

          <div>
            <label htmlFor="content_mdx" className="block text-sm font-medium text-gray-700 mb-2">MDX Content</label>
            <textarea id="content_mdx" name="content_mdx" defaultValue={paper.content_mdx || ''} rows={12} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"></textarea>
          </div>

          <div>
            <label htmlFor="pdf_url" className="block text-sm font-medium text-gray-700 mb-2">PDF URL (optional)</label>
            <input type="url" id="pdf_url" name="pdf_url" defaultValue={paper.pdf_url || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
          </div>

          <div>
            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-2">Linked Location (Map Pin)</label>
            <select id="location_id" name="location_id" defaultValue={paper.location_id || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option value="">-- No Location Linked --</option>
              {locations?.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.city ? `(${loc.city}, ${loc.country})` : `(${loc.country})`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="is_published" name="is_published" defaultChecked={paper.is_published} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Published</label>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
