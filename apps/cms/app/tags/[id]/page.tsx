import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '../../../utils/supabase/server'
import { updateTag, deleteTag } from '../actions'

export default async function EditTag({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tag } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single()

  if (!tag) {
    notFound()
  }

  return (
    <div className="max-w-lg">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/tags" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Tags
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Tag</h1>
        </div>
        <form action={deleteTag.bind(null, tag.id)}>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            onClick={(e) => { if (!confirm('Delete this tag? This cannot be undone.')) e.preventDefault() }}
          >
            Delete Tag
          </button>
        </form>
      </div>

      <form action={updateTag} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-5">
        <input type="hidden" name="id" value={tag.id} />

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
          <input
            id="name" name="name" type="text" required
            defaultValue={tag.name}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className="text-sm font-medium text-gray-700">Slug</label>
          <input
            id="slug" name="slug" type="text" required
            defaultValue={tag.slug}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-gray-900 bg-white"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
