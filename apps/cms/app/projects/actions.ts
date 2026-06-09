'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'
import { revalidateWeb } from '../../utils/revalidateWeb'


export async function createProject(formData: FormData) {
  const supabase = createAdminClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const content_mdx = (formData.get('content_mdx') as string) || ''
  const url = (formData.get('url') as string) || null
  const github_url = (formData.get('github_url') as string) || null
  const is_published = formData.get('is_published') === 'on'
  
  const { error } = await supabase.from('projects').insert({
    title,
    slug,
    description,
    content_mdx,
    url: url || null,
    github_url: github_url || null,
    is_published,
    date: new Date().toISOString()
  })

  if (error) {
    console.error('[createProject] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to create project: ${error.message}`)
  }

  revalidatePath('/projects')
  await revalidateWeb(['projects', `project-${slug}`])
  redirect('/projects')
}

export async function updateProject(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const content_mdx = (formData.get('content_mdx') as string) || ''
  const url = (formData.get('url') as string) || null
  const github_url = (formData.get('github_url') as string) || null
  const is_published = formData.get('is_published') === 'on'
  
  const { error } = await supabase
    .from('projects')
    .update({
      title,
      slug,
      description,
      content_mdx,
      url: url || null,
      github_url: github_url || null,
      is_published,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('[updateProject] Supabase error:', JSON.stringify(error))
    throw new Error(`Failed to update project: ${error.message}`)
  }

  revalidatePath('/projects')
  await revalidateWeb(['projects', `project-${slug}`])
  redirect('/projects')
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) {
    console.error('[deleteProject]', JSON.stringify(error))
    throw new Error(`Failed to delete project: ${error.message}`)
  }
  revalidatePath('/projects')
  await revalidateWeb(['projects'])
}
