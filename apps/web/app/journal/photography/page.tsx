import { createClient } from '../../../utils/supabase/server'
import { GalleryClient } from './GalleryClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography | Sunder',
  description: 'A visual diary and photography collection.',
}

export default async function PhotographyPage() {
  const supabase = await createClient()

  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('importance_score', { ascending: false })
    .order('created_at', { ascending: false })

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .order('capture_date', { ascending: false })

  return (
    <div className="flex flex-col w-full">

      {/* HEADER */}
      <section className="section-full py-20 md:py-28">
        <span className="section-number">01</span>
        <div className="section-label">section.photography</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-4">Photography</h1>
        <p className="text-base text-[#666] font-mono max-w-xl">
          Moments captured, metadata extracted, visual stories told.
        </p>
      </section>

      {/* ALBUMS */}
      {albums && albums.length > 0 && (
        <section className="section-full pb-16 border-t border-[#d1d5db] pt-12">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-6">Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album: any) => (
              <div key={album.id} className="group cursor-pointer relative overflow-hidden aspect-[4/3] bg-[#e5e5e5] border border-[#d1d5db] flex flex-col justify-end">
                {album.cover_image_url && (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{album.title}</h3>
                  {album.description && (
                    <p className="text-white/70 text-xs font-mono line-clamp-2">{album.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PHOTOSTREAM */}
      <section className="section-full pb-32 border-t border-[#d1d5db] pt-12">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#999] mb-6">Photostream</h2>
        {photos && photos.length > 0 ? (
          <GalleryClient photos={photos} />
        ) : (
          <div className="py-24 text-center border border-[#d1d5db] bg-white">
            <p className="font-mono text-sm text-[#999]">No photos uploaded yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
