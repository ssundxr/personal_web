'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../utils/supabase/admin'

// 1. Update Core Vitals (Mission, Focus, Location, Travel)
export async function saveVitals(formData: FormData) {
  const supabase = createAdminClient()

  const mission = formData.get('mission') as string
  const focus = formData.get('focus') as string
  const location = formData.get('location') as string
  const travel = formData.get('travel') as string

  const vitals = [
    { slug: 'mission', value: mission },
    { slug: 'focus', value: focus },
    { slug: 'location', value: location },
    { slug: 'travel', value: travel },
  ]

  for (const vital of vitals) {
    if (vital.value !== null) {
      // Upsert into pos_entries
      const { data: existing } = await supabase
        .from('pos_entries')
        .select('id')
        .eq('section_slug', vital.slug)
        .single()

      if (existing) {
        await supabase
          .from('pos_entries')
          .update({ title: vital.value, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('pos_entries')
          .insert({
            section_slug: vital.slug,
            title: vital.value,
            status: 'active',
            order_index: 0,
          })
      }
    }
  }

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 2. Toggle Section Visibility
export async function toggleSection(slug: string, isVisible: boolean) {
  const supabase = createAdminClient()

  await supabase
    .from('pos_sections')
    .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
    .eq('slug', slug)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 3. Add dynamic shelf entry (Tech stack, Reading, Listening, Building, Learning)
export async function addEntry(formData: FormData) {
  const supabase = createAdminClient()

  const section_slug = formData.get('section_slug') as string
  const title = formData.get('title') as string
  const subtitle = formData.get('subtitle') as string
  const url = formData.get('url') as string
  const image_url = formData.get('image_url') as string
  const progressStr = formData.get('progress') as string
  const orderStr = formData.get('order_index') as string

  const progress = progressStr ? parseInt(progressStr, 10) : null
  const order_index = orderStr ? parseInt(orderStr, 10) : 0

  await supabase.from('pos_entries').insert({
    section_slug,
    title,
    subtitle: subtitle || null,
    url: url || null,
    image_url: image_url || null,
    progress,
    status: 'active',
    order_index,
  })

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 4. Archive / Hard Delete shelf entry
export async function deleteEntry(id: string) {
  const supabase = createAdminClient()

  await supabase.from('pos_entries').delete().eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 5. Add Research Tracker item
export async function addResearchTracker(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const progressStr = formData.get('progress') as string
  const target_date = formData.get('target_date') as string
  const related_research_id = formData.get('related_research_id') as string

  const progress = progressStr ? parseInt(progressStr, 10) : 0

  await supabase.from('pos_research_tracker').insert({
    title,
    description: description || null,
    status,
    progress,
    target_date: target_date || null,
    related_research_id: related_research_id || null,
  })

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 6. Update Research Tracker progress
export async function updateResearchProgress(id: string, progress: number, status: string) {
  const supabase = createAdminClient()

  await supabase
    .from('pos_research_tracker')
    .update({ progress, status, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 7. Delete Research Tracker item
export async function deleteResearchTracker(id: string) {
  const supabase = createAdminClient()

  await supabase.from('pos_research_tracker').delete().eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 8. Add Goal
export async function addGoal(formData: FormData) {
  const supabase = createAdminClient()

  const quarter = formData.get('quarter') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string
  const progressStr = formData.get('progress') as string
  const target_date = formData.get('target_date') as string

  const progress = progressStr ? parseInt(progressStr, 10) : 0

  await supabase.from('pos_goals').insert({
    quarter,
    title,
    description: description || null,
    status,
    progress,
    target_date: target_date || null,
  })

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 9. Update Goal Progress
export async function updateGoalProgress(id: string, progress: number, status: string) {
  const supabase = createAdminClient()

  await supabase
    .from('pos_goals')
    .update({ progress, status, updated_at: new Date().toISOString() })
    .eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 10. Delete Goal
export async function deleteGoal(id: string) {
  const supabase = createAdminClient()

  await supabase.from('pos_goals').delete().eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 11. Add Achievement
export async function addAchievement(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const icon = formData.get('icon') as string
  const url = formData.get('url') as string

  await supabase.from('pos_achievements').insert({
    title,
    description: description || null,
    date,
    icon: icon || null,
    url: url || null,
  })

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 12. Delete Achievement
export async function deleteAchievement(id: string) {
  const supabase = createAdminClient()

  await supabase.from('pos_achievements').delete().eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 13. Add Manual Activity log
export async function addActivity(formData: FormData) {
  const supabase = createAdminClient()

  const content = formData.get('content') as string
  const activity_type = formData.get('activity_type') as string

  await supabase.from('pos_activity').insert({
    content,
    activity_type,
    timestamp: new Date().toISOString(),
  })

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}

// 14. Delete Activity Log
export async function deleteActivity(id: string) {
  const supabase = createAdminClient()

  await supabase.from('pos_activity').delete().eq('id', id)

  revalidatePath('/pos')
  revalidatePath('/now')
  revalidatePath('/')
}
