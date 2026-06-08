'use client'

import { useState } from 'react'
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/mapbox'
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
}

export default function GlobalMap({ locations }: { locations: LocationData[] }) {
  const [popupInfo, setPopupInfo] = useState<LocationData | null>(null)
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

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
    <div className="w-full h-[calc(100vh-64px)] relative bg-gray-900">
      <Map
        initialViewState={{
          longitude: 10,
          latitude: 30,
          zoom: 1.5
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        cursor="grab"
      >
        <NavigationControl position="top-right" />
        
        {locations.map(loc => (
          <Marker
            key={loc.id}
            longitude={loc.longitude}
            latitude={loc.latitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation()
              setPopupInfo(loc)
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
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
