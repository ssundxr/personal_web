import { createClient } from '../../utils/supabase/server'
import { addAlbum, uploadPhoto, deletePhoto } from './actions'
import Link from 'next/link'

export default async function PhotographyCMSPage() {
  const supabase = await createClient()

  // Fetch albums
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch recent photos
  const { data: photos } = await supabase
    .from('photos')
    .select(`
      id, title, image_url, camera_make, camera_model, focal_length, aperture, capture_date
    `)
    .order('capture_date', { ascending: false })
    .limit(20)

  return (
    <div className="pb-16 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Photography Studio</h1>
          <p className="text-sm text-gray-500 mt-1">Manage albums, collections, and upload photos with automatic EXIF extraction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Upload & Recent Photos */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Card: Photo Uploader */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Photo</h2>
            
            <form action={uploadPhoto} className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                <input 
                  type="file" 
                  name="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  required
                  className="mb-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-900 hover:file:bg-primary-100"
                />
                <span className="text-xs">Supports JPG, PNG, WEBP. EXIF metadata will be auto-extracted.</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. Sunset at Big Sur"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Album (Optional)</label>
                  <select name="album_id" className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option value="">-- No Album --</option>
                    {(albums || []).map(album => (
                      <option key={album.id} value={album.id}>{album.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Caption / Backstory</label>
                <textarea
                  name="caption"
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Optional context about this shot..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Era</label>
                  <input
                    type="text"
                    name="era"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. V2, University"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Importance (1-10)</label>
                  <input
                    type="number"
                    name="importance_score"
                    defaultValue="5"
                    min="1"
                    max="10"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button type="submit" className="px-4 py-2 bg-primary-900 text-white font-medium text-sm rounded-lg hover:bg-primary-900/90 transition-colors">
                  Upload & Extract Metadata
                </button>
              </div>
            </form>
          </div>

          {/* Card: Recent Photos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(photos || []).length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No photos uploaded yet.</p>
              ) : (
                (photos || []).map(photo => (
                  <div key={photo.id} className="flex flex-col gap-2 group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                      <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                      <form action={deletePhoto.bind(null, photo.id, photo.image_url)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="submit" className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-600">×</button>
                      </form>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-gray-900 truncate">{photo.title}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {photo.camera_make} {photo.camera_model}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400">
                        {photo.focal_length} • {photo.aperture}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Albums & Collections */}
        <div className="flex flex-col gap-8">
          
          {/* Card: Add Album Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Album</h2>
            
            <form action={addAlbum} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g. Japan 2024"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</label>
                <input
                  type="text"
                  name="slug"
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-600"
                  placeholder="japan-2024"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Short context about this album..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cover Image URL</label>
                <input
                  type="url"
                  name="cover_image_url"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
              
              <button type="submit" className="w-full mt-2 px-4 py-2 bg-gray-900 text-white font-medium text-sm rounded-lg hover:bg-gray-800 transition-colors">
                Create Album
              </button>
            </form>
          </div>

          {/* Card: Albums List */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Albums</h2>
            
            <div className="flex flex-col gap-3">
              {(albums || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No albums created yet.</p>
              ) : (
                (albums || []).map(album => (
                  <div key={album.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group border border-transparent hover:border-gray-100 transition-colors">
                    {album.cover_image_url ? (
                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0 bg-gray-100">
                        <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md shrink-0 bg-gray-100 flex items-center justify-center text-gray-400">
                        <span className="text-[10px] uppercase font-bold">No Cover</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{album.title}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">/{album.slug}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
