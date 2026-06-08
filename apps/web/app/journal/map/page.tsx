import { createClient } from '../../../utils/supabase/server'
import MapView from './MapView'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Journey Map | Sunder OS',
  description: 'Interactive map tracing life experiences geographically.'
}

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const supabase = await createClient()

  // Fetch stories that are linked to a location
  const { data: storiesData, error } = await supabase
    .from('stories')
    .select(`
      id,
      slug,
      title,
      content_mdx,
      date,
      location:location_id (
        id,
        name,
        city,
        state,
        country,
        latitude,
        longitude,
        location_type,
        description,
        era,
        cover_image
      )
    `)
    .not('location_id', 'is', null)
    .order('date', { ascending: false })

  if (error) {
    console.error("Error fetching stories with locations:", error)
  }

  // Map the nested location data and inject the storySlug so GlobalMap popups work seamlessly
  const mappedStories = (storiesData || []).map((s: any) => ({
    ...s,
    location: {
      ...s.location,
      storySlug: s.slug
    }
  }))

  return (
    <div className="w-full flex flex-col flex-1 h-[calc(100vh-64px)] bg-gray-900">
      <MapView stories={mappedStories} />
    </div>
  )
}
