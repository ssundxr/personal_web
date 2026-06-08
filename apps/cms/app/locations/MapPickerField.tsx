'use client'

import { useState } from 'react'
import MapPicker from '../../components/MapPicker'

export default function MapPickerField() {
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  return (
    <div className="flex flex-col gap-2 col-span-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pick Location on Map</label>
      <MapPicker 
        onLocationSelect={(l, ln) => {
          setLat(l.toFixed(6))
          setLng(ln.toFixed(6))
        }} 
      />
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Latitude</label>
          <input type="number" step="any" name="latitude" required value={lat} onChange={(e) => setLat(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="47.3769" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Longitude</label>
          <input type="number" step="any" name="longitude" required value={lng} onChange={(e) => setLng(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white" placeholder="8.5417" />
        </div>
      </div>
    </div>
  )
}
