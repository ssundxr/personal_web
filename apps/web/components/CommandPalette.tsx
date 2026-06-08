'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, FileText, Briefcase, FlaskConical, MapPin, Camera, Clock, X, Loader2 } from 'lucide-react'
import { searchDiscovery, SearchResult } from '../app/actions/search'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Execute search when query changes
  useEffect(() => {
    if (!searchQuery) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        const hits = await searchDiscovery(searchQuery)
        setResults(hits)
      })
    }, 200) // 200ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  const onSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  if (!open) return null

  // Group results by type
  const stories = results.filter(r => r.type === 'story')
  const projects = results.filter(r => r.type === 'project')
  const research = results.filter(r => r.type === 'research')
  const locations = results.filter(r => r.type === 'location')
  const photos = results.filter(r => r.type === 'photo')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col">
        <Command label="Global Command Menu" shouldFilter={false} className="flex flex-col w-full bg-transparent">
          <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Search stories, projects, locations, photos..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-lg w-full"
            />
            {isPending && <Loader2 className="w-5 h-5 text-slate-400 animate-spin shrink-0 ml-3" />}
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 transition-colors ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
            <Command.Empty className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              {searchQuery ? "No results found for your query." : "Type a query to search the ecosystem."}
            </Command.Empty>

            {!searchQuery && (
              <Command.Group heading="Quick Actions" className="text-xs font-medium text-slate-500 px-2 py-2">
                <Command.Item onSelect={() => onSelect('/')} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors">
                  <Clock className="w-4 h-4" /> Go to Timeline
                </Command.Item>
                <Command.Item onSelect={() => onSelect('/map')} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors">
                  <MapPin className="w-4 h-4" /> Open Global Map
                </Command.Item>
                <Command.Item onSelect={() => onSelect('/archive')} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer text-sm text-slate-700 dark:text-slate-300 aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-500/10 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 transition-colors">
                  <FileText className="w-4 h-4" /> Browse Archive
                </Command.Item>
              </Command.Group>
            )}

            {stories.length > 0 && (
              <Command.Group heading="Stories & Thoughts" className="text-xs font-medium text-slate-500 px-2 py-2">
                {stories.map((item) => (
                  <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                    <FileText className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                      {item.description && <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {projects.length > 0 && (
              <Command.Group heading="Projects" className="text-xs font-medium text-slate-500 px-2 py-2">
                {projects.map((item) => (
                  <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                    <Briefcase className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                      {item.description && <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {research.length > 0 && (
              <Command.Group heading="Research" className="text-xs font-medium text-slate-500 px-2 py-2">
                {research.map((item) => (
                  <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                    <FlaskConical className="w-4 h-4 mt-0.5 text-purple-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                      {item.description && <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {locations.length > 0 && (
              <Command.Group heading="Locations" className="text-xs font-medium text-slate-500 px-2 py-2">
                {locations.map((item) => (
                  <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                    <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                      {item.era && <span className="text-xs text-slate-500 mt-0.5">{item.era}</span>}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {photos.length > 0 && (
              <Command.Group heading="Photography" className="text-xs font-medium text-slate-500 px-2 py-2">
                {photos.map((item) => (
                  <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer aria-selected:bg-slate-100 dark:aria-selected:bg-slate-800 transition-colors">
                    <Camera className="w-4 h-4 mt-0.5 text-rose-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.title}</span>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          
          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">↑</kbd>
                <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">↵</kbd>
                to select
              </span>
            </div>
            <span>Powered by Native Search</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
