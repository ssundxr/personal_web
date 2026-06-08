'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function createStory(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const content_mdx = formData.get('content_mdx') as string
  const is_published = formData.get('is_published') === 'on'
  
  const { error } = await supabase.from('stories').insert({
    title,
    slug,
    content_mdx,
    is_published,
    date: new Date().toISOString()
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to create story')
  }

  revalidatePath('/stories')
  revalidatePath('/archive', 'page')
  redirect('/stories')
}
