import { createClient } from "../../../utils/supabase/server"
import TimelineView, { TimelineEvent } from './TimelineView'

interface TimelinePageProps {
  searchParams: Promise<{ category?: string }>
}

export const revalidate = 60

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const params = await searchParams
  const activeCategory = typeof params.category === 'string' ? params.category : 'all'

  const supabase = await createClient()

  const { data: rawEvents } = await supabase
    .from('timeline_events')
    .select(`
      *,
      location:location_id(*),
      story:story_id(title, slug),
      project:project_id(title, slug),
      research:research_id(title, slug)
    `)
    .order('date', { ascending: false })

  const events = (rawEvents || []) as TimelineEvent[]

  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => e.category === activeCategory)

  const categories = [
    { slug: 'all', label: 'All' },
    { slug: 'career', label: 'Career' },
    { slug: 'education', label: 'Education' },
    { slug: 'research', label: 'Research' },
    { slug: 'project', label: 'Projects' },
    { slug: 'achievement', label: 'Achievements' },
    { slug: 'travel', label: 'Travel' },
    { slug: 'personal', label: 'Personal' }
  ]

  return <TimelineView events={filteredEvents} categories={categories} activeCategory={activeCategory} />
}
