'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'
import { revalidateWeb } from '../../utils/revalidateWeb'
import { z } from 'zod'

const storySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content_mdx: z.string().min(1, 'Content is required'),
  is_published: z.boolean(),
  location_id: z.string().uuid().nullable().optional(),
})


export async function createStory(formData: FormData) {
  const supabase = createAdminClient()

  const parsed = storySchema.safeParse({
    title: formData.get('title'),
    slug: formData.get('slug'),
    content_mdx: formData.get('content_mdx'),
    is_published: formData.get('is_published') === 'on',
    location_id: formData.get('location_id') || null,
  })

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`)
  }

  const { title, slug, content_mdx, is_published, location_id } = parsed.data

  const { error } = await supabase.from('stories').insert({
    title,
    slug,
    content_mdx,
    is_published,
    location_id,
    date: new Date().toISOString()
  })

  if (error) {
    console.error('[createStory] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to create story: ${error.message}`)
  }

  revalidatePath('/stories')
  await revalidateWeb(['stories', `story-${slug}`])
  redirect('/stories')
}

export async function updateStory(formData: FormData) {
  const supabase = createAdminClient()

  const parsed = storySchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    content_mdx: formData.get('content_mdx'),
    is_published: formData.get('is_published') === 'on',
    location_id: formData.get('location_id') || null,
  })

  if (!parsed.success) {
    throw new Error(`Validation failed: ${parsed.error.message}`)
  }

  const { id, title, slug, content_mdx, is_published, location_id } = parsed.data

  if (!id) throw new Error('ID is required for update')

  const { error } = await supabase
    .from('stories')
    .update({
      title,
      slug,
      content_mdx,
      is_published,
      location_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('[updateStory] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to update story: ${error.message}`)
  }

  revalidatePath('/stories')
  await revalidateWeb(['stories', `story-${slug}`])
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
  await revalidateWeb(['stories'])
}
