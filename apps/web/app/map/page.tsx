import { createClient } from '../../utils/supabase/server'
import GlobalMap from './GlobalMap'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Global Journey Map | Sunder OS',
  description: 'Interactive map tracing life experiences geographically.'
}

// Mapbox CSS needs to be loaded globally or locally, it's imported in the client component

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const supabase = await createClient()

  // Fetch public locations
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching locations:", error)
  }

  return (
    <div className="w-full flex flex-col flex-1 h-[calc(100vh-64px)] bg-gray-900">
      <GlobalMap locations={locations || []} />
    </div>
  )
}
