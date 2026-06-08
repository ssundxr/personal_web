import { createClient } from '../../utils/supabase/server'
import { GalleryClient } from './GalleryClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography | Ecosystem',
  description: 'A visual diary and photography collection.',
}

export default async function PhotographyPage() {
  const supabase = await createClient()

  // Fetch albums
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('importance_score', { ascending: false })
    .order('created_at', { ascending: false })

  // Fetch all photos (we can add pagination later if it grows too large)
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('capture_date', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">Photography</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Moments captured, extracted metadata, and visual stories.
        </p>
      </header>

      {/* Featured Albums (If any exist) */}
      {albums && albums.length > 0 && (
        <section className="mb-24">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100 flex flex-col justify-end">
                {album.cover_image_url && (
                  <img 
                    src={album.cover_image_url} 
                    alt={album.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{album.title}</h3>
                  {album.description && (
                    <p className="text-white/80 text-sm line-clamp-2">{album.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photostream (Masonry Gallery) */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">Photostream</h2>
        {photos && photos.length > 0 ? (
          <GalleryClient photos={photos} />
        ) : (
          <div className="py-24 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            <p className="text-gray-500">No photos uploaded yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
