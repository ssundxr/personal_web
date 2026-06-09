import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '../../../utils/supabase/admin'
import { updateTimelineEvent, deleteTimelineEvent } from '../actions'
import DeleteButton from '../../components/DeleteButton'

export const dynamic = 'force-dynamic';


export default async function EditTimelineEvent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()


  const [
    { data: event },
    { data: stories },
    { data: projects },
    { data: research },
    { data: achievements },
    { data: locations },
  ] = await Promise.all([
    supabase.from('timeline_events').select('*').eq('id', id).single(),
    supabase.from('stories').select('id, title').eq('is_published', true).order('title'),
    supabase.from('projects').select('id, title').eq('is_published', true).order('title'),
    supabase.from('research').select('id, title').eq('is_published', true).order('title'),
    supabase.from('pos_achievements').select('id, title').order('title'),
    supabase.from('locations').select('id, name').order('name'),
  ])

  if (!event) {
    notFound()
  }

  // updateTimelineEvent takes (id, formData) — we need to bind the id
  const updateAction = updateTimelineEvent.bind(null, event.id)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/timeline" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Timeline
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Timeline Event</h1>
        </div>
        <form action={deleteTimelineEvent.bind(null, event.id)}>
          <DeleteButton 
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            confirmMessage="Delete this milestone? This cannot be undone."
          >
            Delete Milestone
          </DeleteButton>
        </form>
      </div>

      <form action={updateAction} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Event Title</label>
          <input
            id="title" name="title" type="text" required
            defaultValue={event.title}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
            <select
              id="category" name="category" required
              defaultValue={event.category}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            >
              <option value="career">Career</option>
              <option value="education">Education</option>
              <option value="research">Research</option>
              <option value="project">Project</option>
              <option value="certification">Certification</option>
              <option value="achievement">Achievement</option>
              <option value="travel">Travel</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">Date</label>
            <input
              id="date" name="date" type="date" required
              defaultValue={event.date ? event.date.split('T')[0] : ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Importance & Era */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="importance_score" className="text-sm font-medium text-gray-700">Importance (1–10)</label>
            <input
              id="importance_score" name="importance_score" type="number" min="1" max="10"
              defaultValue={event.importance_score ?? 5}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="era" className="text-sm font-medium text-gray-700">Era Label</label>
            <input
              id="era" name="era" type="text"
              defaultValue={event.era || ''}
              placeholder="e.g. Zurich Academia"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description" name="description" rows={4}
            defaultValue={event.description || ''}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* Cover Image */}
        <div className="flex flex-col gap-2">
          <label htmlFor="cover_image" className="text-sm font-medium text-gray-700">Cover Image URL</label>
          <input
            id="cover_image" name="cover_image" type="text"
            defaultValue={event.cover_image || ''}
            placeholder="https://res.cloudinary.com/..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* Entity Links */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Link to Existing Asset</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="story_id" className="text-sm font-medium text-gray-700">Story Link</label>
              <select id="story_id" name="story_id" defaultValue={event.story_id || ''} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white">
                <option value="">-- None --</option>
                {(stories || []).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="project_id" className="text-sm font-medium text-gray-700">Project Link</label>
              <select id="project_id" name="project_id" defaultValue={event.project_id || ''} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white">
                <option value="">-- None --</option>
                {(projects || []).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="research_id" className="text-sm font-medium text-gray-700">Research Link</label>
              <select id="research_id" name="research_id" defaultValue={event.research_id || ''} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white">
                <option value="">-- None --</option>
                {(research || []).map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="achievement_id" className="text-sm font-medium text-gray-700">Achievement Link</label>
              <select id="achievement_id" name="achievement_id" defaultValue={event.achievement_id || ''} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white">
                <option value="">-- None --</option>
                {(achievements || []).map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="location_id" className="text-sm font-medium text-gray-700">Location Map Pin</label>
              <select id="location_id" name="location_id" defaultValue={event.location_id || ''} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white">
                <option value="">-- None --</option>
                {(locations || []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2">
          <input
            type="hidden" name="is_featured" value="false"
          />
          <input
            type="checkbox" id="is_featured" name="is_featured"
            value="true"
            defaultChecked={event.is_featured}
            className="w-4 h-4 text-primary-900 rounded border-gray-300 focus:ring-primary-900"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Mark as Featured Milestone</label>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-900/90 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
