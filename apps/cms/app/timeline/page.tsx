import { createClient } from '../../utils/supabase/server'
import {
  addTimelineEvent,
  deleteTimelineEvent,
  toggleFeatured
} from './actions'

export default async function TimelineCMSPage() {
  const supabase = await createClient()

  // Fetch timeline events
  const { data: events } = await supabase
    .from('timeline_events')
    .select(`
      *,
      story:story_id(title),
      project:project_id(title),
      research:research_id(title),
      achievement:achievement_id(title)
    `)
    .order('date', { ascending: false })

  // Fetch entities for dropdown link selectors
  const { data: stories } = await supabase.from('stories').select('id, title').eq('is_published', true).order('title')
  const { data: projects } = await supabase.from('projects').select('id, title').eq('is_published', true).order('title')
  const { data: research } = await supabase.from('research').select('id, title').eq('is_published', true).order('title')
  const { data: achievements } = await supabase.from('pos_achievements').select('id, title').order('title')
  const { data: locations } = await supabase.from('locations').select('id, name').order('name')

  return (
    <div className="pb-16 text-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Life Journey Timeline</h1>
        <p className="text-sm text-gray-500 mt-1">Manage, rank, and view the chronological milestone record of your personal and professional growth.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT FORM: Add Timeline Event */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Event</h2>
          <form action={addTimelineEvent} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Event Title</label>
              <input
                type="text"
                name="title"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                placeholder="e.g. Relocated to Zurich"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</label>
                <select name="category" required className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white">
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Importance (1-10)</label>
                <input
                  type="number"
                  name="importance_score"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Era Label</label>
                <input
                  type="text"
                  name="era"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                  placeholder="e.g. Zurich Academia"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
              <textarea
                name="description"
                rows={3}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                placeholder="Brief summary of what happened..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cover Image URL</label>
              <input
                type="text"
                name="cover_image"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>

            {/* Entity Linking dropdowns */}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Link to Existing Asset</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Story Link</label>
                  <select name="story_id" className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- None --</option>
                    {(stories || []).map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Project Link</label>
                  <select name="project_id" className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- None --</option>
                    {(projects || []).map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Research Link</label>
                  <select name="research_id" className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- None --</option>
                    {(research || []).map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Achievement Link</label>
                  <select name="achievement_id" className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- None --</option>
                    {(achievements || []).map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-gray-500">Location Map Pin</label>
                  <select name="location_id" className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- None --</option>
                    {(locations || []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_featured" name="is_featured" value="true" className="rounded border-gray-300 text-primary-900" />
              <label htmlFor="is_featured" className="text-xs font-semibold text-gray-700">Mark as Featured Milestone</label>
            </div>

            <button type="submit" className="w-full mt-2 py-2 bg-primary-900 text-white font-medium text-sm rounded-lg hover:bg-primary-900/90 transition-colors">
              Publish Milestone
            </button>
          </form>
        </div>

        {/* RIGHT LIST: Timeline Events List */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Chronological Milestones</h2>

          <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1">
            {(events || []).length === 0 ? (
              <p className="text-sm text-gray-400 italic">No timeline milestones configured yet.</p>
            ) : (
              (events || []).map((event) => (
                <div key={event.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{event.title}</span>
                      <span className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {event.category}
                      </span>
                      <span className="text-[10px] font-bold bg-primary-50 text-primary-800 border border-primary-100 px-2 py-0.5 rounded-full font-mono">
                        Rank: {event.importance_score}
                      </span>
                      {event.era && (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-full">
                          Era: {event.era}
                        </span>
                      )}
                      {event.is_featured && (
                        <span className="text-[9px] uppercase font-black bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 leading-normal">{event.description || 'No description provided.'}</p>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono">
                      📅 {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>

                    {/* Show mappings */}
                    {(event.story || event.project || event.research || event.achievement) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {event.story && <span className="text-[10px] text-primary-800 font-semibold bg-primary-50/50 px-2 py-0.5 rounded">Story: {event.story.title}</span>}
                        {event.project && <span className="text-[10px] text-primary-800 font-semibold bg-primary-50/50 px-2 py-0.5 rounded">Project: {event.project.title}</span>}
                        {event.research && <span className="text-[10px] text-primary-800 font-semibold bg-primary-50/50 px-2 py-0.5 rounded">Research: {event.research.title}</span>}
                        {event.achievement && <span className="text-[10px] text-primary-800 font-semibold bg-primary-50/50 px-2 py-0.5 rounded">Achievement: {event.achievement.title}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <form action={toggleFeatured.bind(null, event.id, !event.is_featured)}>
                      <button type="submit" className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                        {event.is_featured ? 'Unstar' : 'Star'}
                      </button>
                    </form>
                    <form action={deleteTimelineEvent.bind(null, event.id)}>
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-900 transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
