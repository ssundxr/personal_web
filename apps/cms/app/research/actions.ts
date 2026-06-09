'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'
import { revalidateWeb } from '../../utils/revalidateWeb'


export async function createResearch(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const abstract = formData.get('abstract') as string
  const content_mdx = (formData.get('content_mdx') as string) || ''
  const pdf_url = (formData.get('pdf_url') as string) || null
  const is_published = formData.get('is_published') === 'on'
  
  const { error } = await supabase.from('research').insert({
    title,
    slug,
    abstract,
    content_mdx,
    pdf_url: pdf_url || null,
    is_published,
    date: new Date().toISOString()
  })

  if (error) {
    console.error('[createResearch] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to create research: ${error.message}`)
  }

  revalidatePath('/research')
  await revalidateWeb(['research', `research-${slug}`])
  redirect('/research')
}

export async function updateResearch(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const abstract = formData.get('abstract') as string
  const content_mdx = (formData.get('content_mdx') as string) || ''
  const pdf_url = (formData.get('pdf_url') as string) || null
  const is_published = formData.get('is_published') === 'on'
  
  const { error } = await supabase
    .from('research')
    .update({
      title,
      slug,
      abstract,
      content_mdx,
      pdf_url: pdf_url || null,
      is_published,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('[updateResearch] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to update research: ${error.message}`)
  }

  revalidatePath('/research')
  await revalidateWeb(['research', `research-${slug}`])
  redirect('/research')
}

export async function deleteResearch(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('research').delete().eq('id', id)
  if (error) {
    console.error('[deleteResearch]', JSON.stringify(error))
    throw new Error(`Failed to delete research: ${error.message}`)
  }
  revalidatePath('/research')
  await revalidateWeb(['research'])
}
