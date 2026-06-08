'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'

export async function createStory(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content_mdx = formData.get('content_mdx') as string
  const is_published = formData.get('is_published') === 'on'
  const location_id = (formData.get('location_id') as string) || null
  
  const { error } = await supabase.from('stories').insert({
    title,
    slug,
    content_mdx,
    is_published,
    location_id: location_id || null,
    date: new Date().toISOString()
  })

  if (error) {
    console.error('[createStory] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to create story: ${error.message} (code: ${error.code})`)
  }

  revalidatePath('/stories')
  revalidatePath('/archive', 'page')
  redirect('/stories')
}

export async function updateStory(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content_mdx = formData.get('content_mdx') as string
  const is_published = formData.get('is_published') === 'on'
  const location_id = (formData.get('location_id') as string) || null
  
  const { error } = await supabase
    .from('stories')
    .update({
      title,
      slug,
      content_mdx,
      is_published,
      location_id: location_id || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('[updateStory] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to update story: ${error.message} (code: ${error.code})`)
  }

  revalidatePath('/stories')
  revalidatePath('/archive', 'page')
  revalidatePath(`/archive/${slug}`, 'page')
  redirect('/stories')
}

export async function deleteStory(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('stories').delete().eq('id', id)
  if (error) {
    console.error('[deleteStory] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to delete story: ${error.message}`)
  }
  revalidatePath('/stories')
  revalidatePath('/archive', 'page')
}
