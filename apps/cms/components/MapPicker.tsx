'use client'

import { useState, useCallback, useEffect } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapPickerProps {
  initialLat?: number
  initialLng?: number
  onLocationSelect: (lat: number, lng: number) => void
}

export default function MapPicker({
  initialLat = 0,
  initialLng = 0,
  onLocationSelect
}: MapPickerProps) {
  const [marker, setMarker] = useState({ lat: initialLat, lng: initialLng })
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  
  useEffect(() => {
    setMarker({ lat: initialLat, lng: initialLng })
  }, [initialLat, initialLng])

  const onMapClick = useCallback((e: any) => {
    const lat = e.lngLat.lat
    const lng = e.lngLat.lng
    setMarker({ lat, lng })
    onLocationSelect(lat, lng)
  }, [onLocationSelect])

  if (!mapboxToken) {
    return (
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center flex-col gap-2">
        <p className="text-gray-500 font-medium">Mapbox Token Missing</p>
        <p className="text-xs text-gray-400">Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local to enable the map picker.</p>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 relative">
      <Map
        initialViewState={{
          longitude: initialLng,
          latitude: initialLat,
          zoom: 1
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        onClick={onMapClick}
        cursor="crosshair"
      >
        <NavigationControl position="bottom-right" />
        {marker.lat !== 0 && marker.lng !== 0 && (
          <Marker 
            longitude={marker.lng} 
            latitude={marker.lat} 
            color="#0f172a" 
            anchor="bottom"
          />
        )}
      </Map>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm border border-gray-200 pointer-events-none">
        <p className="text-xs font-semibold text-gray-700">Click map to drop pin</p>
      </div>
    </div>
  )
}
