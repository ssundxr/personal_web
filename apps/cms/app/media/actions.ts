'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '../../utils/supabase/admin'

export async function uploadMedia(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file selected');
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  // 1. Upload to Cloudinary
  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append('file', file);
  cloudinaryFormData.append('upload_preset', uploadPreset!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: cloudinaryFormData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
  }

  // 2. Save reference to Supabase
  const supabase = createAdminClient()
  const { error } = await supabase.from('media').insert({
    url: data.secure_url,
    // we can also store format, size, etc. inside exif_data
    exif_data: {
      public_id: data.public_id,
      format: data.format,
      bytes: data.bytes
    }
  });

  if (error) {
    console.error(error);
    throw new Error('Failed to save media record to database');
  }

  revalidatePath('/media');
  redirect('/media');
}
