import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '../../../utils/supabase/admin'
import { updateLocation, deleteLocation } from '../actions'
import MapPickerField from '../MapPickerField'
import DeleteButton from '../../components/DeleteButton'

export const dynamic = 'force-dynamic';

export default async function EditLocation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()


  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (!location) {
    notFound()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/locations" className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 inline-block">
            ← Back to Locations
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900">Edit Location</h1>
        </div>
        <form action={deleteLocation.bind(null, location.id)}>
          <DeleteButton 
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            confirmMessage="Delete this location pin? This cannot be undone."
          >
            Delete Location
          </DeleteButton>
        </form>
      </div>

      <form action={updateLocation} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
        <input type="hidden" name="id" value={location.id} />

        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">Location Name</label>
          <input
            id="name" name="name" type="text" required
            defaultValue={location.name}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* City / State / Country */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
            <input
              id="city" name="city" type="text"
              defaultValue={location.city || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="state" className="text-sm font-medium text-gray-700">State / Region</label>
            <input
              id="state" name="state" type="text"
              defaultValue={location.state || ''}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="country" className="text-sm font-medium text-gray-700">Country</label>
            <input
              id="country" name="country" type="text" required
              defaultValue={location.country}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude</label>
            <input
              id="latitude" name="latitude" type="number" step="any" required
              defaultValue={location.latitude}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-gray-900 bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude</label>
            <input
              id="longitude" name="longitude" type="number" step="any" required
              defaultValue={location.longitude}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 font-mono text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Type & Visit Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="location_type" className="text-sm font-medium text-gray-700">Location Type</label>
            <select
              id="location_type" name="location_type" required
              defaultValue={location.location_type}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            >
              <option value="travel">Travel</option>
              <option value="research">Research</option>
              <option value="conference">Conference</option>
              <option value="education">Education</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
              <option value="project">Project</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="visit_date" className="text-sm font-medium text-gray-700">Visit Date</label>
            <input
              id="visit_date" name="visit_date" type="date"
              defaultValue={location.visit_date || ''}
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
              defaultValue={location.importance_score ?? 5}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="era" className="text-sm font-medium text-gray-700">Era Label</label>
            <input
              id="era" name="era" type="text"
              defaultValue={location.era || ''}
              placeholder="e.g. Zurich Academia"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description" name="description" rows={3}
            defaultValue={location.description || ''}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* Cover Image */}
        <div className="flex flex-col gap-2">
          <label htmlFor="cover_image" className="text-sm font-medium text-gray-700">Cover Image URL</label>
          <input
            id="cover_image" name="cover_image" type="text"
            defaultValue={location.cover_image || ''}
            placeholder="https://res.cloudinary.com/..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900/20 text-gray-900 bg-white"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-2">
          <input
            type="hidden" name="is_featured" value="false"
          />
          <input
            type="checkbox" id="is_featured" name="is_featured"
            value="true"
            defaultChecked={location.is_featured}
            className="w-4 h-4 text-primary-900 rounded border-gray-300 focus:ring-primary-900"
          />
          <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">Feature on Global Map Highlights</label>
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
