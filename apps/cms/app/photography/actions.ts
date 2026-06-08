'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../utils/supabase/server'
import exifr from 'exifr'

// Helper to sanitize filename
function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
}

// 1. Upload Photo & Extract EXIF
export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  const title = formData.get('title') as string
  const caption = formData.get('caption') as string
  const era = formData.get('era') as string
  const importanceStr = formData.get('importance_score') as string
  const albumId = formData.get('album_id') as string
  
  const importance_score = importanceStr ? parseInt(importanceStr, 10) : 5

  if (!file || file.size === 0) {
    throw new Error('No file provided')
  }

  // Convert File to Buffer for exifr
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  let exifData: any = {}
  try {
    // Parse EXIF for GPS and camera data
    exifData = await exifr.parse(buffer) || {}
  } catch (err) {
    console.error('Error parsing EXIF:', err)
  }

  const camera_make = exifData.Make || null
  const camera_model = exifData.Model || null
  const lens = exifData.LensModel || null
  const focal_length = exifData.FocalLength ? `${exifData.FocalLength}mm` : null
  const aperture = exifData.FNumber ? `f/${exifData.FNumber}` : null
  const shutter_speed = exifData.ExposureTime ? `1/${Math.round(1 / exifData.ExposureTime)}` : null
  const iso = exifData.ISO || null
  const capture_date = exifData.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toISOString() : new Date().toISOString()
  const latitude = exifData.latitude || null
  const longitude = exifData.longitude || null
  
  // Format resolution
  const width = exifData.ExifImageWidth || exifData.ImageWidth || null
  const height = exifData.ExifImageHeight || exifData.ImageHeight || null
  const resolution = width && height ? `${width}x${height}` : null

  // Upload to Supabase Storage 'photos' bucket
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${sanitizeFileName(file.name)}`
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('photos')
    .upload(`uploads/${fileName}`, file, {
      cacheControl: '31536000',
      upsert: false
    })

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    throw new Error('Failed to upload image')
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(uploadData.path)

  // Insert to photos table
  const { data: photoData, error: insertError } = await supabase.from('photos').insert({
    title: title || 'Untitled',
    caption: caption || null,
    image_url: publicUrl,
    camera_make,
    camera_model,
    lens,
    focal_length,
    aperture,
    shutter_speed,
    iso,
    resolution,
    capture_date,
    latitude,
    longitude,
    era: era || null,
    importance_score
  }).select('id').single()

  if (insertError) {
    console.error('DB Insert Error:', insertError)
    throw new Error('Failed to save photo metadata')
  }

  // If album provided, link it
  if (albumId && photoData) {
    await supabase.from('album_photos').insert({
      album_id: albumId,
      photo_id: photoData.id,
      order_index: 0
    })
  }

  revalidatePath('/photography')
  revalidatePath('/albums')
}

// 2. Add Album
export async function addAlbum(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const cover_image_url = formData.get('cover_image_url') as string
  const era = formData.get('era') as string
  const importanceStr = formData.get('importance_score') as string
  
  const importance_score = importanceStr ? parseInt(importanceStr, 10) : 5

  await supabase.from('albums').insert({
    title,
    slug,
    description: description || null,
    cover_image_url: cover_image_url || null,
    era: era || null,
    importance_score
  })

  revalidatePath('/photography')
  revalidatePath('/albums')
}

// 3. Delete Photo
export async function deletePhoto(id: string, imageUrl: string) {
  const supabase = await createClient()
  
  // Extract path from publicUrl
  const urlParts = imageUrl.split('/photos/')
  if (urlParts.length === 2 && urlParts[1]) {
    const path = urlParts[1]
    await supabase.storage.from('photos').remove([path])
  }

  await supabase.from('photos').delete().eq('id', id)
  
  revalidatePath('/photography')
}
