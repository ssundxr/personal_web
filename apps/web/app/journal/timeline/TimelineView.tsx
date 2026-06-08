'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LocationData } from '../map/GlobalMap'

export interface TimelineEvent {
  id: string
  title: string
  description: string | null
  category: string
  date: string
  year: number
  era: string | null
  location: LocationData | null
  story: { slug: string; title: string } | null
  project: { slug: string; title: string } | null
  research: { slug: string; title: string } | null
}

export default function TimelineView({ events, categories, activeCategory }: { events: TimelineEvent[], categories: any[], activeCategory: string }) {
  // Map intersection observer is removed since we are now full-screen timeline


  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0efed] relative items-center">
      
      {/* TIMELINE (Full Screen) */}
      <div className="w-full max-w-4xl flex flex-col p-6 md:p-12 pb-32">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 mt-12 text-center">Journey Logs</h1>
        <p className="font-mono text-sm text-[#666] mb-12 max-w-2xl text-center mx-auto">Chronological milestones and events forming the chapters of life.</p>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-16 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/journal/timeline?category=${cat.slug}`}
              className={`font-mono text-[10px] uppercase px-4 py-2 transition-colors border ${
                activeCategory === cat.slug
                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                  : 'border-[#d1d5db] text-[#666] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* List */}
        <div className="relative border-l border-[#d1d5db] pl-8 flex flex-col gap-12 max-w-2xl mx-auto w-full">
          {events.length === 0 ? (
            <p className="font-mono text-sm text-[#999] text-center">No events found.</p>
          ) : (
            events.map((event, idx) => (
              <div 
                key={event.id} 
                className="relative flex flex-col"
                data-index={idx}
              >
                <span className="absolute -left-[38px] top-1.5 w-3 h-3 border border-[#d1d5db] bg-[#f0efed]" />
                
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#999] mb-2">
                  <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  <span className="w-1 h-1 bg-[#d1d5db]" />
                  <span className="uppercase text-[#1a1a1a] font-semibold">{event.category}</span>
                  {event.location && (
                    <>
                      <span className="w-1 h-1 bg-[#d1d5db]" />
                      <span className="text-[#3b5bdb] flex items-center gap-1">
                         {event.location.city || event.location.country}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{event.title}</h3>
                {event.description && <p className="text-base text-[#666] leading-relaxed mb-4">{event.description}</p>}

                {(event.story || event.project || event.research) && (
                  <div className="flex flex-wrap gap-4 mt-1 border-t border-[#d1d5db] pt-4">
                    {event.story && <Link href={`/journal/archive/${event.story.slug}`} className="font-mono text-[10px] uppercase text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">Read Story</Link>}
                    {event.project && <Link href={`/journal/projects/${event.project.slug}`} className="font-mono text-[10px] uppercase text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">View Project</Link>}
                    {event.research && <Link href={`/journal/research/${event.research.slug}`} className="font-mono text-[10px] uppercase text-[#1a1a1a] hover:text-[#3b5bdb] transition-colors">Read Research</Link>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
