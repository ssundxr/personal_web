import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '../../../../utils/supabase/admin'
import { updateAlbum, deletePhoto } from '../../actions'

export const dynamic = 'force-dynamic';


export default async function EditAlbum({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()


  const [{ data: album }, { data: photos }] = await Promise.all([
    supabase.from('albums').select('*').eq('id', id).single(),
    supabase.from('photos').select('id, title, image_url, thumbnail_url').eq('album_id', id).order('capture_date', { ascending: false }),
  ])

  if (!album) {
    notFound()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/photography" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Photography
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Album</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Edit Form */}
        <div className="xl:col-span-1">
          <form action={updateAlbum} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
            <input type="hidden" name="id" value={album.id} />

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                id="title" name="title" type="text" required
                defaultValue={album.title}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="slug" className="text-sm font-medium text-gray-700">Slug</label>
              <input
                id="slug" name="slug" type="text" required
                defaultValue={album.slug}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-gray-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description" name="description" rows={3}
                defaultValue={album.description || ''}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="cover_image_url" className="text-sm font-medium text-gray-700">Cover Image URL</label>
              <input
                id="cover_image_url" name="cover_image_url" type="text"
                defaultValue={album.cover_image || ''}
                placeholder="https://..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="era" className="text-sm font-medium text-gray-700">Era</label>
                <input
                  id="era" name="era" type="text"
                  defaultValue={album.era || ''}
                  placeholder="e.g. V2"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="importance_score" className="text-sm font-medium text-gray-700">Importance (1–10)</label>
                <input
                  id="importance_score" name="importance_score" type="number" min="1" max="10"
                  defaultValue={album.importance_score ?? 5}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
                Save Album
              </button>
            </div>
          </form>
        </div>

        {/* Photos in this album */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Photos in Album <span className="text-gray-400 font-normal text-sm">({(photos || []).length})</span>
          </h2>

          {(photos || []).length === 0 ? (
            <p className="text-sm text-gray-400 italic">No photos in this album yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(photos || []).map(photo => (
                <div key={photo.id} className="flex flex-col gap-2 group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                    <img src={photo.thumbnail_url || photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link
                        href={`/photography/photos/${photo.id}`}
                        className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate">{photo.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
