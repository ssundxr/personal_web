import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function TagsCMSPage() {
  const supabase = await createClient()

  // Fetch all tags
  const { data: tags } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  async function addTag(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    
    if (!name || !slug) return

    const sb = await createClient()
    await sb.from('tags').insert({ name, slug })
    revalidatePath('/tags')
  }

  async function deleteTag(id: string) {
    'use server'
    const sb = await createClient()
    await sb.from('tags').delete().eq('id', id)
    revalidatePath('/tags')
  }

  return (
    <div className="pb-16 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Taxonomy (Tags)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage global tags used across Stories, Projects, Research, and Photos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Card: Add Tag */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Tag</h2>
          
          <form action={addTag} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</label>
              <input
                type="text"
                name="name"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                placeholder="e.g. Artificial Intelligence"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</label>
              <input
                type="text"
                name="slug"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-600 bg-white"
                placeholder="artificial-intelligence"
              />
            </div>
            
            <button type="submit" className="w-full mt-2 px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-800 transition-colors">
              Create Tag
            </button>
          </form>
        </div>

        {/* Card: Tags List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Tags</h2>
          
          <div className="flex flex-wrap gap-2">
            {(tags || []).length === 0 ? (
              <p className="text-sm text-gray-500">No tags created yet.</p>
            ) : (
              (tags || []).map(tag => (
                <div key={tag.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <span className="font-medium text-gray-900">{tag.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">/{tag.slug}</span>
                  <form action={deleteTag.bind(null, tag.id)}>
                    <button type="submit" className="text-gray-400 hover:text-red-500 font-bold ml-1">×</button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
