import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '../../../../utils/supabase/admin'
import { updatePhoto, deletePhoto } from '../../actions'
import DeleteButton from '../../../components/DeleteButton'

export const dynamic = 'force-dynamic';


export default async function EditPhoto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()


  const [{ data: photo }, { data: albums }] = await Promise.all([
    supabase.from('photos').select('*').eq('id', id).single(),
    supabase.from('albums').select('id, title').order('title'),
  ])

  if (!photo) {
    notFound()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/photography" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Photography
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Photo</h1>
        </div>
        <form action={deletePhoto.bind(null, photo.id, photo.image_url)}>
          <DeleteButton 
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            confirmMessage="Delete this photo? This cannot be undone."
          >
            Delete Photo
          </DeleteButton>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Photo Preview */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-100">
              <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
            </div>
            {/* EXIF Metadata */}
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">EXIF Data (read-only)</h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {photo.exif_camera && <><span className="text-gray-400">Camera</span><span className="font-mono text-gray-700">{photo.exif_camera}</span></>}
                {photo.exif_lens && <><span className="text-gray-400">Lens</span><span className="font-mono text-gray-700">{photo.exif_lens}</span></>}
                {photo.exif_focal_length && <><span className="text-gray-400">Focal</span><span className="font-mono text-gray-700">{photo.exif_focal_length}</span></>}
                {photo.exif_aperture && <><span className="text-gray-400">Aperture</span><span className="font-mono text-gray-700">{photo.exif_aperture}</span></>}
                {photo.exif_shutter && <><span className="text-gray-400">Shutter</span><span className="font-mono text-gray-700">{photo.exif_shutter}</span></>}
                {photo.exif_iso && <><span className="text-gray-400">ISO</span><span className="font-mono text-gray-700">{photo.exif_iso}</span></>}
                {photo.date_taken && <><span className="text-gray-400">Taken</span><span className="font-mono text-gray-700">{new Date(photo.date_taken).toLocaleDateString()}</span></>}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="xl:col-span-2">
          <form action={updatePhoto} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5">
            <input type="hidden" name="id" value={photo.id} />

            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                id="title" name="title" type="text" required
                defaultValue={photo.title}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="album_id" className="text-sm font-medium text-gray-700">Album</label>
              <select
                id="album_id" name="album_id"
                defaultValue={photo.album_id || ''}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              >
                <option value="">-- No Album --</option>
                {(albums || []).map(album => (
                  <option key={album.id} value={album.id}>{album.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">Caption / Backstory</label>
              <textarea
                id="description" name="description" rows={4}
                defaultValue={photo.description || ''}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="era" className="text-sm font-medium text-gray-700">Era</label>
                <input
                  id="era" name="era" type="text"
                  defaultValue={photo.metadata?.era || ''}
                  placeholder="e.g. V2, University"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="importance_score" className="text-sm font-medium text-gray-700">Importance (1–10)</label>
                <input
                  id="importance_score" name="importance_score" type="number" min="1" max="10"
                  defaultValue={photo.importance_score ?? 5}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
