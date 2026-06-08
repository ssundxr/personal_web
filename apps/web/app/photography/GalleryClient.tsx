'use client'

import { useState } from "react"
import PhotoAlbum from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import { Camera } from "lucide-react"

interface PhotoRecord {
  id: string
  title: string
  caption: string | null
  image_url: string
  camera_make: string | null
  camera_model: string | null
  lens: string | null
  focal_length: string | null
  aperture: string | null
  shutter_speed: string | null
  iso: number | null
  capture_date: string | null
  resolution: string | null
}

export function GalleryClient({ photos }: { photos: PhotoRecord[] }) {
  const [index, setIndex] = useState(-1)

  // Format photos for react-photo-album
  // We don't have intrinsic width/height in our DB if we just saved the resolution string
  // Let's parse resolution or default to 3:2 ratio if missing
  const albumPhotos = photos.map(photo => {
    let w = 1200
    let h = 800
    if (photo.resolution) {
      const parts = photo.resolution.split('x')
      if (parts.length === 2 && parts[0] && parts[1]) {
        w = parseInt(parts[0], 10)
        h = parseInt(parts[1], 10)
      }
    }
    
    // Format description text for the lightbox caption
    const metadata = [
      photo.camera_make && photo.camera_model ? `${photo.camera_make} ${photo.camera_model}` : null,
      photo.focal_length,
      photo.aperture,
      photo.shutter_speed ? `1/${photo.shutter_speed}` : null, // Assuming DB might have stored the raw string '1/250' or '250', we saved '1/250' earlier
      photo.iso ? `ISO ${photo.iso}` : null
    ].filter(Boolean).join(' • ')

    return {
      src: photo.image_url,
      width: w,
      height: h,
      title: photo.title,
      description: photo.caption ? `${photo.caption}\n\n📷 ${metadata}` : `📷 ${metadata}`,
      photoRecord: photo
    }
  })

  return (
    <>
      <PhotoAlbum 
        layout="masonry" 
        photos={albumPhotos} 
        columns={(containerWidth) => {
          if (containerWidth < 640) return 1
          if (containerWidth < 1024) return 2
          return 3
        }}
        spacing={16}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={albumPhotos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions, Zoom]}
        captions={{
          showToggle: true,
          descriptionTextAlign: "start",
          descriptionMaxLines: 5
        }}
      />
    </>
  )
}
