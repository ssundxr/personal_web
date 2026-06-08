'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../utils/supabase/server'

// 1. Add manual timeline event
export async function addTimelineEvent(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const cover_image = formData.get('cover_image') as string
  const era = formData.get('era') as string
  
  const importanceStr = formData.get('importance_score') as string
  const isFeaturedStr = formData.get('is_featured') as string
  
  const story_id = formData.get('story_id') as string
  const project_id = formData.get('project_id') as string
  const research_id = formData.get('research_id') as string
  const achievement_id = formData.get('achievement_id') as string
  const location_id = formData.get('location_id') as string

  const importance_score = importanceStr ? parseInt(importanceStr, 10) : 5
  const is_featured = isFeaturedStr === 'true'

  await supabase.from('timeline_events').insert({
    title,
    description: description || null,
    category,
    date,
    cover_image: cover_image || null,
    era: era || null,
    importance_score,
    is_featured,
    story_id: story_id || null,
    project_id: project_id || null,
    research_id: research_id || null,
    achievement_id: achievement_id || null,
    location_id: location_id || null,
  })

  revalidatePath('/timeline')
  revalidatePath('/')
}

// 2. Update existing timeline event
export async function updateTimelineEvent(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const date = formData.get('date') as string
  const cover_image = formData.get('cover_image') as string
  const era = formData.get('era') as string
  const location_id = formData.get('location_id') as string
  
  const importanceStr = formData.get('importance_score') as string
  const isFeaturedStr = formData.get('is_featured') as string

  const importance_score = importanceStr ? parseInt(importanceStr, 10) : 5
  const is_featured = isFeaturedStr === 'true'

  await supabase
    .from('timeline_events')
    .update({
      title,
      description: description || null,
      category,
      date,
      cover_image: cover_image || null,
      era: era || null,
      location_id: location_id || null,
      importance_score,
      is_featured,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  revalidatePath('/timeline')
  revalidatePath('/')
}

// 3. Delete timeline event
export async function deleteTimelineEvent(id: string) {
  const supabase = await createClient()

  await supabase.from('timeline_events').delete().eq('id', id)

  revalidatePath('/timeline')
  revalidatePath('/')
}

// 4. Toggle Featured status
export async function toggleFeatured(id: string, isFeatured: boolean) {
  const supabase = await createClient()

  await supabase
    .from('timeline_events')
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/timeline')
  revalidatePath('/')
}
