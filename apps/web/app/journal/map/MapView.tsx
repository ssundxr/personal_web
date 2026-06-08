'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import GlobalMap, { LocationData } from './GlobalMap'

export interface MapStory {
  id: string
  slug: string
  title: string
  content_mdx: string
  date: string
  location: LocationData
}

export default function MapView({ stories }: { stories: MapStory[] }) {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null)
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // When a map pin is clicked, the GlobalMap can call this (we'll pass it a callback or just sync via state if we wrap it)
  // Wait, GlobalMap currently maintains its own state. Let's pass activeLocation and onPinClick.
  
  const handlePinClick = (locationId: string) => {
    const story = stories.find(s => s.location.id === locationId)
    if (story) {
      setActiveStoryId(story.id)
      // Scroll the story into view
      const el = itemRefs.current[story.id]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  // Extract locations for the map
  const locations = stories.map(s => s.location)
  const activeLocation = stories.find(s => s.id === activeStoryId)?.location || null

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] bg-[#f0efed] relative overflow-hidden">
      
      {/* LEFT: STORY LIST */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto flex flex-col p-6 md:p-12 pb-32 border-r border-[#d1d5db]">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#1a1a1a] mb-4 mt-6">Atlas</h1>
        <p className="font-mono text-sm text-[#666] mb-12 max-w-sm">
          Interactive geographical journal. Click a pin on the map to read the associated story abstract.
        </p>

        <div className="flex flex-col gap-12">
          {stories.length === 0 ? (
            <p className="font-mono text-sm text-[#999]">No stories mapped yet.</p>
          ) : (
            stories.map((story) => {
              const isActive = activeStoryId === story.id
              // Auto-generate abstract from content_mdx (strip out complex markdown if possible, but slicing is fine for now)
              const abstract = story.content_mdx.length > 150 ? story.content_mdx.substring(0, 150) + '...' : story.content_mdx

              return (
                <div 
                  key={story.id} 
                  ref={(el) => { itemRefs.current[story.id] = el }}
                  className={`flex flex-col p-6 transition-all border ${isActive ? 'bg-white border-[#1a1a1a] shadow-lg' : 'bg-transparent border-transparent hover:border-[#d1d5db]'}`}
                  onClick={() => setActiveStoryId(story.id)}
                >
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#999] mb-3 uppercase tracking-wider">
                    <span>{new Date(story.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    <span className="w-1 h-1 bg-[#d1d5db]" />
                    <span className="text-[#3b5bdb] flex items-center gap-1">
                       <span className="w-1.5 h-1.5 bg-[#3b5bdb] rounded-full" />
                       {story.location.city || story.location.country}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3 leading-tight">{story.title}</h3>
                  <p className="text-sm text-[#666] leading-relaxed mb-6">{abstract}</p>

                  {isActive && (
                    <Link 
                      href={`/journal/archive/${story.slug}`} 
                      className="w-fit font-mono text-[10px] uppercase bg-[#1a1a1a] text-white px-4 py-2 hover:bg-[#3b5bdb] transition-colors"
                    >
                      Read Full Story
                    </Link>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT: MAP */}
      <div className="w-full lg:w-[55%] h-[50vh] lg:h-full relative z-0">
         <GlobalMap 
            locations={locations} 
            activeLocation={activeLocation} 
            onPinClick={handlePinClick} 
         />
      </div>
    </div>
  )
}
