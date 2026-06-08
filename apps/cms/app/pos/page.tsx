import { createClient } from '../../utils/supabase/server'
import {
  saveVitals,
  toggleSection,
  addEntry,
  deleteEntry,
  addResearchTracker,
  updateResearchProgress,
  deleteResearchTracker,
  addGoal,
  updateGoalProgress,
  deleteGoal,
  addAchievement,
  deleteAchievement,
  addActivity,
  deleteActivity,
} from './actions'

export default async function POSManagerPage() {
  const supabase = await createClient()

  // Fetch sections
  const { data: sections } = await supabase
    .from('pos_sections')
    .select('*')
    .order('slug')

  // Fetch entries
  const { data: entries } = await supabase
    .from('pos_entries')
    .select('*')
    .order('order_index', { ascending: true })

  // Fetch active research tracker items
  const { data: researchTrackers } = await supabase
    .from('pos_research_tracker')
    .select(`
      id,
      title,
      description,
      status,
      progress,
      target_date,
      related_research_id,
      research (
        title
      )
    `)
    .order('updated_at', { ascending: false })

  // Fetch published research for dropdown list
  const { data: researchPapers } = await supabase
    .from('research')
    .select('id, title')
    .eq('is_published', true)
    .order('title')

  // Fetch quarterly goals
  const { data: goals } = await supabase
    .from('pos_goals')
    .select('*')
    .order('quarter', { ascending: false })
    .order('created_at', { ascending: true })

  // Fetch achievements
  const { data: achievements } = await supabase
    .from('pos_achievements')
    .select('*')
    .order('date', { ascending: false })

  // Fetch recent activity
  const { data: activities } = await supabase
    .from('pos_activity')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(15)

  // Group entries by section_slug
  const entryMap = (entries || []).reduce((acc, entry) => {
    if (!acc[entry.section_slug]) acc[entry.section_slug] = []
    acc[entry.section_slug].push(entry)
    return acc
  }, {} as Record<string, typeof entries>)

  const getVitalValue = (slug: string) => {
    const list = entryMap[slug] || []
    return list[0]?.title || ''
  }

  const sectionMap = (sections || []).reduce((acc, sec) => {
    acc[sec.slug] = sec.is_visible
    return acc
  }, {} as Record<string, boolean>)

  return (
    <div className="pb-16 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Personal OS (/now)</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the metrics, dynamic feeds, and vitals shown on your public /now page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Vitals & Tech Stack */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Card: Core Vitals */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Core Vitals</h2>
            <form action={saveVitals} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current Mission</label>
                <textarea
                  name="mission"
                  defaultValue={getVitalValue('mission')}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                  placeholder="What is your overall core mission statement?"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current Focus</label>
                <textarea
                  name="focus"
                  defaultValue={getVitalValue('focus')}
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                  placeholder="What is your immediate day-to-day focus?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Current Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={getVitalValue('location')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Travel Status</label>
                  <input
                    type="text"
                    name="travel"
                    defaultValue={getVitalValue('travel')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
                    placeholder="e.g. Staying local / Traveling to Zurich in June"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button type="submit" className="px-4 py-2 bg-primary-900 text-white font-medium text-sm rounded-lg hover:bg-primary-900/90 transition-colors">
                  Save Vitals
                </button>
              </div>
            </form>
          </div>

          {/* Card: Tech Stack Manager */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Tech Stack</h2>
              <form action={toggleSection.bind(null, 'stack', !sectionMap['stack'])}>
                <button type="submit" className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sectionMap['stack'] ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                  {sectionMap['stack'] ? 'Visible' : 'Hidden'}
                </button>
              </form>
            </div>

            {/* List current stack items */}
            <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
              {(entryMap['stack'] || []).length === 0 ? (
                <span className="text-xs text-gray-400">No technologies added to your stack yet.</span>
              ) : (
                (entryMap['stack'] || []).map((tech) => (
                  <div key={tech.id} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium">
                    <span className="text-gray-900">{tech.title}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{tech.subtitle}</span>
                    <form action={deleteEntry.bind(null, tech.id)}>
                      <button type="submit" className="text-gray-400 hover:text-red-600 font-bold ml-1">×</button>
                    </form>
                  </div>
                ))
              )}
            </div>

            {/* Add new tech form */}
            <form action={addEntry} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="hidden" name="section_slug" value="stack" />
              <input
                type="text"
                name="title"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg text-xs md:col-span-2 text-gray-900 bg-white"
                placeholder="Tech Name (e.g., PyTorch)"
              />
              <select name="subtitle" className="px-2 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                <option value="Languages">Languages</option>
                <option value="Frameworks">Frameworks</option>
                <option value="Databases">Databases</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Tools & Libraries">Tools & Libraries</option>
              </select>
              <button type="submit" className="px-3 py-2 bg-gray-900 text-white font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors">
                Add Tech
              </button>
            </form>
          </div>

          {/* Card: Shelf Lists (Building, Learning, Reading, Listening) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
            <h2 className="text-lg font-semibold text-gray-900">Dynamic Shelf Lists</h2>

            {['building', 'learning', 'reading', 'listening'].map((slug) => {
              const label = slug.charAt(0).toUpperCase() + slug.slice(1)
              const items = entryMap[slug] || []

              return (
                <div key={slug} className="border-t border-gray-100 pt-6 first:border-0 first:pt-0">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">{label} Shelf</h3>
                    <form action={toggleSection.bind(null, slug, !sectionMap[slug])}>
                      <button type="submit" className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sectionMap[slug] ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                        {sectionMap[slug] ? 'Visible' : 'Hidden'}
                      </button>
                    </form>
                  </div>

                  {/* List current shelf items */}
                  <div className="flex flex-col gap-2 mb-4">
                    {items.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Shelf is empty.</p>
                    ) : (
                      items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-gray-900">{item.title}</span>
                            {item.subtitle && <span className="text-gray-500">{item.subtitle}</span>}
                            {item.progress !== null && <span className="text-primary-800 font-medium mt-0.5">Progress: {item.progress}%</span>}
                          </div>
                          <form action={deleteEntry.bind(null, item.id)}>
                            <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-900 transition-colors">
                              Remove
                            </button>
                          </form>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Entry Form */}
                  <form action={addEntry} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <input type="hidden" name="section_slug" value={slug} />
                    <input
                      type="text"
                      name="title"
                      required
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs md:col-span-2 text-gray-900 bg-white"
                      placeholder="Title (e.g. Clean Code)"
                    />
                    <input
                      type="text"
                      name="subtitle"
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                      placeholder="Subtitle / Author / Stack"
                    />
                    <input
                      type="number"
                      name="progress"
                      min="0"
                      max="100"
                      className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                      placeholder="Progress %"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-gray-950 text-white font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors">
                      Add Item
                    </button>
                  </form>
                </div>
              )
            })}
          </div>

          {/* Card: Research Tracker Manager */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Tracker</h2>
            
            {/* List active research trackers */}
            <div className="flex flex-col gap-4 mb-6">
              {(researchTrackers || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No research trackers active.</p>
              ) : (
                (researchTrackers || []).map((tracker) => (
                  <div key={tracker.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">{tracker.title}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                          {tracker.status.replace('-', ' ')}
                        </span>
                      </div>
                      {tracker.description && <p className="text-xs text-gray-500 mb-2">{tracker.description}</p>}
                      {tracker.research && (
                        <div className="text-[10px] text-primary-800 font-semibold mb-2">
                          🔗 Connected Research: {tracker.research.title}
                        </div>
                      )}
                      
                      {/* Interactive Progress Updater */}
                      <form action={async (formData: FormData) => {
                        'use server'
                        const progress = parseInt(formData.get('progress') as string, 10)
                        const status = formData.get('status') as string
                        await updateResearchProgress(tracker.id, progress, status)
                      }} className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-gray-500 font-semibold">Progress:</label>
                          <input
                            type="number"
                            name="progress"
                            defaultValue={tracker.progress}
                            min="0"
                            max="100"
                            className="w-16 px-1.5 py-0.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                          />
                          <span className="text-xs">%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <label className="text-[10px] text-gray-500 font-semibold">Status:</label>
                          <select
                            name="status"
                            defaultValue={tracker.status}
                            className="px-1.5 py-0.5 border border-gray-300 rounded text-xs text-gray-900 bg-white"
                          >
                            <option value="planning">Planning</option>
                            <option value="literature-review">Literature Review</option>
                            <option value="methodology">Methodology</option>
                            <option value="experimentation">Experimentation</option>
                            <option value="writing">Writing</option>
                            <option value="submitted">Submitted</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                        <button type="submit" className="px-2 py-0.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-[10px] font-bold">
                          Update
                        </button>
                      </form>
                    </div>

                    <form action={deleteResearchTracker.bind(null, tracker.id)}>
                      <button type="submit" className="text-xs font-semibold text-red-600 hover:text-red-900">
                        Remove
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>

            {/* Add Research Tracker Form */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Add Research Tracker</h3>
              <form action={addResearchTracker} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="title"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                    placeholder="Research Title"
                  />
                  <select name="status" className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="planning">Planning</option>
                    <option value="literature-review">Literature Review</option>
                    <option value="methodology">Methodology</option>
                    <option value="experimentation">Experimentation</option>
                    <option value="writing">Writing</option>
                    <option value="submitted">Submitted</option>
                  </select>
                </div>
                <textarea
                  name="description"
                  rows={2}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                  placeholder="Short description of research tasks..."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    defaultValue="0"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                    placeholder="Progress %"
                  />
                  <input
                    type="date"
                    name="target_date"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                  />
                  <select name="related_research_id" className="px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                    <option value="">-- Link to Public Research --</option>
                    {(researchPapers || []).map((paper) => (
                      <option key={paper.id} value={paper.id}>
                        {paper.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-gray-950 text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors">
                    Create Tracker
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Goals, Achievements, Activity Feed */}
        <div className="flex flex-col gap-8">
          
          {/* Card: Goals Manager */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Goals</h2>
            
            {/* List goals */}
            <div className="flex flex-col gap-3 mb-6">
              {(goals || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No goals added yet.</p>
              ) : (
                (goals || []).map((goal) => (
                  <div key={goal.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-gray-900">{goal.title}</span>
                        <span className="ml-2 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {goal.quarter}
                        </span>
                      </div>
                      <form action={deleteGoal.bind(null, goal.id)}>
                        <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
                      </form>
                    </div>

                    <form action={async (formData: FormData) => {
                      'use server'
                      const progress = parseInt(formData.get('progress') as string, 10)
                      const status = formData.get('status') as string
                      await updateGoalProgress(goal.id, progress, status)
                    }} className="flex items-center justify-between gap-2 border-t border-gray-200/50 pt-2 mt-1">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          name="progress"
                          defaultValue={goal.progress}
                          min="0"
                          max="100"
                          className="w-12 px-1 border border-gray-300 rounded text-[11px] text-gray-950 bg-white"
                        />
                        <span>%</span>
                      </div>
                      <select
                        name="status"
                        defaultValue={goal.status}
                        className="px-1 border border-gray-300 rounded text-[11px] text-gray-950 bg-white"
                      >
                        <option value="not-started">Not Started</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="deferred">Deferred</option>
                      </select>
                      <button type="submit" className="px-1.5 py-0.5 bg-gray-900 text-white rounded text-[10px]">
                        Save
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>

            {/* Add Goal Form */}
            <form action={addGoal} className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Add Goal</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="quarter"
                  required
                  placeholder="e.g. 2026-Q2"
                  className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
                />
                <select name="status" className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <input
                type="text"
                name="title"
                required
                placeholder="Goal Title"
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
              />
              <button type="submit" className="px-3 py-1.5 bg-gray-950 text-white font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors">
                Add Goal
              </button>
            </form>
          </div>

          {/* Card: Achievements */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h2>
            
            {/* List achievements */}
            <div className="flex flex-col gap-2 mb-6">
              {(achievements || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No achievements recorded.</p>
              ) : (
                (achievements || []).map((ach) => (
                  <div key={ach.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{ach.title}</span>
                      <p className="text-[10px] text-gray-400">{ach.date}</p>
                    </div>
                    <form action={deleteAchievement.bind(null, ach.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700">Delete</button>
                    </form>
                  </div>
                ))
              )}
            </div>

            {/* Add Achievement Form */}
            <form action={addAchievement} className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Add Achievement</h3>
              <input
                type="text"
                name="title"
                required
                placeholder="Achievement Title"
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
              />
              <input
                type="date"
                name="date"
                required
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
              />
              <input
                type="text"
                name="icon"
                placeholder="Lucide Icon slug (e.g. trophy)"
                className="px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
              />
              <button type="submit" className="px-3 py-1.5 bg-gray-950 text-white font-medium text-xs rounded-lg hover:bg-gray-800 transition-colors">
                Add Achievement
              </button>
            </form>
          </div>

          {/* Card: Activity Feed */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
            
            {/* Quick manual log form */}
            <form action={addActivity} className="flex gap-2 mb-4">
              <input
                type="text"
                name="content"
                required
                placeholder="Quick manual activity update..."
                className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white"
              />
              <select name="activity_type" className="px-1.5 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white">
                <option value="general">General</option>
                <option value="travel">Travel</option>
                <option value="reading">Reading</option>
                <option value="building">Building</option>
              </select>
              <button type="submit" className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-gray-800">
                Log
              </button>
            </form>

            {/* List activities */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto border-t border-gray-100 pt-4 pr-1">
              {(activities || []).length === 0 ? (
                <p className="text-xs text-gray-400 italic">No activity entries found.</p>
              ) : (
                (activities || []).map((act) => (
                  <div key={act.id} className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-start text-xs gap-2">
                    <div className="flex-1">
                      <p className="text-gray-900 leading-tight">{act.content}</p>
                      <span className="text-[9px] text-gray-400 font-semibold">
                        {new Date(act.timestamp).toLocaleString()} • {act.activity_type}
                      </span>
                    </div>
                    <form action={deleteActivity.bind(null, act.id)}>
                      <button type="submit" className="text-gray-400 hover:text-red-600 font-bold">×</button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
