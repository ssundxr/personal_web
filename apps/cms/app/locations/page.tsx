import { createClient } from '../../utils/supabase/server'
import { addLocation, deleteLocation, toggleFeaturedLocation } from './actions'
import MapPickerField from './MapPickerField'
import Link from 'next/link'


export default async function LocationsCMSPage() {
  const supabase = await createClient()

  // Fetch locations
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="pb-16 text-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Locations Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Manage geographic locations for the Global Journey Map spatial graph.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT FORM: Add Location */}
        <div className="xl:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Global Map Pin</h2>
          <form action={addLocation} className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location Name</label>
              <input type="text" name="name" required className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="e.g. ETH Zurich, Central Campus" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">City</label>
                <input type="text" name="city" className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="Zurich" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">State/Region</label>
                <input type="text" name="state" className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="ZH" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Country</label>
                <input type="text" name="country" required className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="Switzerland" />
              </div>
            </div>

            <MapPickerField />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location Type</label>
                <select name="location_type" required className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white">
                  <option value="travel">Travel</option>
                  <option value="research">Research</option>
                  <option value="conference">Conference</option>
                  <option value="education">Education</option>
                  <option value="career">Career</option>
                  <option value="personal">Personal</option>
                  <option value="project">Project</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Visit Date</label>
                <input type="date" name="visit_date" className="px-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Importance (1-10)</label>
                <input type="number" name="importance_score" min="1" max="10" defaultValue="5" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Era Label</label>
                <input type="text" name="era" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="e.g. Zurich Academia" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
              <textarea name="description" rows={3} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="Brief summary of the location..." />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Cover Image URL</label>
              <input type="text" name="cover_image" className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="https://res.cloudinary.com/..." />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" id="is_featured" name="is_featured" value="true" className="rounded border-gray-300 text-primary-900" />
              <label htmlFor="is_featured" className="text-xs font-semibold text-gray-700">Feature on Global Map Highlights</label>
            </div>

            <button type="submit" className="w-full mt-2 py-2 bg-primary-900 text-white font-medium text-sm rounded-lg hover:bg-primary-900/90 transition-colors">
              Add Location Map Pin
            </button>
          </form>
        </div>

        {/* RIGHT LIST: Locations List */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Mapped Locations</h2>

          <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1">
            {(locations || []).length === 0 ? (
              <p className="text-sm text-gray-400 italic">No locations mapped yet.</p>
            ) : (
              (locations || []).map((loc) => (
                <div key={loc.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{loc.name}</span>
                      <span className="text-[10px] font-bold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {loc.location_type}
                      </span>
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded">
                        {loc.country}
                      </span>
                      {loc.era && (
                        <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-100 px-2 py-0.5 rounded-full">
                          Era: {loc.era}
                        </span>
                      )}
                      {loc.is_featured && (
                        <span className="text-[9px] uppercase font-black bg-yellow-50 border border-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 leading-normal">{loc.description || 'No description provided.'}</p>
                    <span className="text-[10px] text-gray-400 font-mono">
                      Coordinates: {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/locations/${loc.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <form action={toggleFeaturedLocation.bind(null, loc.id, !loc.is_featured)}>
                      <button type="submit" className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                        {loc.is_featured ? 'Unstar' : 'Star'}
                      </button>
                    </form>
                    <form action={deleteLocation.bind(null, loc.id)}>
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
