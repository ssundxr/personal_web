'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'

export async function updateTag(formData: FormData) {
  const supabase = createAdminClient()
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string

  await supabase.from('tags').update({ name, slug }).eq('id', id)

  revalidatePath('/tags')
  redirect('/tags')
}

export async function deleteTag(id: string) {
  const supabase = createAdminClient()
  await supabase.from('tags').delete().eq('id', id)
  revalidatePath('/tags')
  redirect('/tags')
}
