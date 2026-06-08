'use client'

import { useEffect, useRef, useState } from 'react'
import Map, { MapRef, Marker, NavigationControl, Popup } from 'react-map-gl/mapbox'
import Link from 'next/link'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface LocationData {
  id: string
  name: string
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
  location_type: string
  description: string
  era: string
  cover_image?: string
  storySlug?: string
}

export default function GlobalMap({ 
  locations, 
  activeLocation,
  onPinClick
}: { 
  locations: LocationData[], 
  activeLocation?: LocationData | null,
  onPinClick?: (id: string) => void
}) {
  const [popupInfo, setPopupInfo] = useState<LocationData | null>(null)
  const mapRef = useRef<MapRef>(null)
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    if (activeLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [activeLocation.longitude, activeLocation.latitude],
        zoom: 4,
        duration: 2000
      })
      setPopupInfo(activeLocation)
    }
  }, [activeLocation])

  if (!mapboxToken) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 flex-col gap-2 border-t border-gray-200">
        <p className="text-gray-500 font-medium">Mapbox Token Missing</p>
        <p className="text-sm text-gray-400">Add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local.</p>
      </div>
    )
  }

  // Choose a subtle, premium dark style for the personal OS theme
  return (
    <div className="w-full h-full relative bg-[#1a1a1a]">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 10,
          latitude: 30,
          zoom: 1.5
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        cursor="grab"
      >
        <NavigationControl position="bottom-right" />
        
        {locations.map(loc => (
          <Marker
            key={loc.id}
            longitude={loc.longitude}
            latitude={loc.latitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation()
              setPopupInfo(loc)
              if (onPinClick) onPinClick(loc.id)
            }}
          >
            <div className="w-3.5 h-3.5 bg-primary-500 rounded-full border-[2.5px] border-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-150 transition-transform duration-200" />
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            maxWidth="260px"
            className="z-10"
          >
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              {popupInfo.cover_image && (
                <div className="w-full h-32 rounded-md overflow-hidden mb-1 relative bg-gray-100">
                  <img 
                    src={popupInfo.cover_image} 
                    alt={popupInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-primary-600">{popupInfo.location_type}</span>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{popupInfo.name}</h3>
                <span className="text-xs text-gray-500">{popupInfo.city ? `${popupInfo.city}, ` : ''}{popupInfo.country}</span>
              </div>
              {popupInfo.era && (
                <span className="text-[10px] font-medium bg-gray-100 text-gray-700 w-fit px-2 py-0.5 rounded-full mt-1">{popupInfo.era}</span>
              )}
              {popupInfo.description && (
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mt-1">{popupInfo.description}</p>
              )}
              {popupInfo.storySlug && (
                <Link 
                  href={`/journal/archive/${popupInfo.storySlug}`}
                  className="mt-2 w-full text-center font-mono text-[10px] uppercase bg-primary-600 text-white py-1.5 rounded hover:bg-primary-700 transition-colors"
                >
                  Read It
                </Link>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
