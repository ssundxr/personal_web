'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type SearchResult = {
  id: string
  title: string
  description: string
  type: 'story' | 'project' | 'research' | 'location' | 'photo'
  url: string
  importance_score: number
  era: string | null
}

export async function searchDiscovery(query: string): Promise<SearchResult[]> {
  if (!query || query.trim() === '') return []
  
  const safeQuery = `%${query.trim()}%`

  // Execute searches in parallel across all ecosystem entities
  const [stories, projects, research, locations, photos] = await Promise.all([
    supabase
      .from('stories')
      .select('id, title, summary, slug, importance_score, era')
      .or(`title.ilike.${safeQuery},summary.ilike.${safeQuery}`)
      .limit(5),
      
    supabase
      .from('projects')
      .select('id, title, description, slug, importance_score, era')
      .or(`title.ilike.${safeQuery},description.ilike.${safeQuery}`)
      .limit(5),
      
    supabase
      .from('research')
      .select('id, title, abstract, slug, importance_score, era')
      .or(`title.ilike.${safeQuery},abstract.ilike.${safeQuery}`)
      .limit(5),
      
    supabase
      .from('locations')
      .select('id, name, description, importance_score, era')
      .or(`name.ilike.${safeQuery},description.ilike.${safeQuery}`)
      .limit(5),
      
    supabase
      .from('photos')
      .select('id, title, description, importance_score, era')
      .or(`title.ilike.${safeQuery},description.ilike.${safeQuery}`)
      .limit(5)
  ])

  const results: SearchResult[] = []

  // Map Stories
  if (stories.data) {
    results.push(...stories.data.map(s => ({
      id: s.id,
      title: s.title,
      description: s.summary || '',
      type: 'story' as const,
      url: `/archive/${s.slug}`,
      importance_score: s.importance_score || 5,
      era: s.era
    })))
  }

  // Map Projects
  if (projects.data) {
    results.push(...projects.data.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description || '',
      type: 'project' as const,
      url: `/projects/${p.slug}`,
      importance_score: p.importance_score || 5,
      era: p.era
    })))
  }

  // Map Research
  if (research.data) {
    results.push(...research.data.map(r => ({
      id: r.id,
      title: r.title,
      description: r.abstract || '',
      type: 'research' as const,
      url: `/research/${r.slug}`,
      importance_score: r.importance_score || 5,
      era: r.era
    })))
  }

  // Map Locations
  if (locations.data) {
    results.push(...locations.data.map(l => ({
      id: l.id,
      title: l.name,
      description: l.description || 'Geographic location',
      type: 'location' as const,
      url: '/map',
      importance_score: l.importance_score || 5,
      era: l.era
    })))
  }

  // Map Photos
  if (photos.data) {
    results.push(...photos.data.map(p => ({
      id: p.id,
      title: p.title || 'Untitled Photo',
      description: p.description || 'Photography',
      type: 'photo' as const,
      url: '/photography',
      importance_score: p.importance_score || 5,
      era: p.era
    })))
  }

  // Sort universally by importance score, then alphabetically
  return results.sort((a, b) => {
    if (b.importance_score !== a.importance_score) {
      return b.importance_score - a.importance_score
    }
    return a.title.localeCompare(b.title)
  })
}
