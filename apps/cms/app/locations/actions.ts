'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../utils/supabase/admin'

// 1. Add Location
export async function addLocation(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const state = formData.get('state') as string
  const country = formData.get('country') as string
  const latitudeStr = formData.get('latitude') as string
  const longitudeStr = formData.get('longitude') as string
  const location_type = formData.get('location_type') as string
  const description = formData.get('description') as string
  const cover_image = formData.get('cover_image') as string
  const visit_date = formData.get('visit_date') as string
  const first_visit_date = formData.get('first_visit_date') as string
  const last_visit_date = formData.get('last_visit_date') as string
  const era = formData.get('era') as string
  const importanceStr = formData.get('importance_score') as string
  const isFeaturedStr = formData.get('is_featured') as string

  const latitude = parseFloat(latitudeStr)
  const longitude = parseFloat(longitudeStr)
  const importance_score = importanceStr ? parseInt(importanceStr, 10) : 5
  const is_featured = isFeaturedStr === 'true'

  await supabase.from('locations').insert({
    name,
    city: city || null,
    state: state || null,
    country,
    latitude,
    longitude,
    location_type,
    description: description || null,
    cover_image: cover_image || null,
    visit_date: visit_date || null,
    first_visit_date: first_visit_date || null,
    last_visit_date: last_visit_date || null,
    era: era || null,
    importance_score,
    is_featured
  })

  revalidatePath('/locations')
  revalidatePath('/map')
}

// 2. Delete Location
export async function deleteLocation(id: string) {
  const supabase = createAdminClient()
  await supabase.from('locations').delete().eq('id', id)
  revalidatePath('/locations')
  revalidatePath('/map')
}

// 3. Toggle Featured Location
export async function toggleFeaturedLocation(id: string, isFeatured: boolean) {
  const supabase = createAdminClient()
  await supabase
    .from('locations')
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq('id', id)
  
  revalidatePath('/locations')
  revalidatePath('/map')
}
