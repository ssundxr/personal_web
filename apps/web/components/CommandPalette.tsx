'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, FileText, Briefcase, FlaskConical, MapPin, Camera, Clock, X, Loader2 } from 'lucide-react'
import { searchDiscovery, SearchResult } from '../app/actions/search'
import { motion, AnimatePresence } from 'framer-motion'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

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
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const onSelect = (url: string) => {
    setOpen(false)
    router.push(url)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 backdrop-blur-md bg-[var(--background)]/40 transition-colors duration-[1200ms]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-2xl bg-[var(--surface)]/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-[var(--border-subtle)] flex flex-col"
          >
            <Command label="Ask the Archive" shouldFilter={false} className="flex flex-col w-full bg-transparent">
              <div className="flex items-center border-b border-[var(--border-subtle)] px-4 py-4">
                <Search className="w-5 h-5 text-[var(--secondary)] mr-3 shrink-0" />
                <Command.Input 
                  autoFocus 
                  placeholder="Ask the Archive..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="flex-1 bg-transparent outline-none font-heading text-xl text-[var(--foreground)] placeholder:text-[var(--secondary)] w-full"
                />
                {isPending && <Loader2 className="w-5 h-5 text-[var(--secondary)] animate-spin shrink-0 ml-3" />}
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--border-subtle)] rounded-md text-[var(--secondary)] transition-colors ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Command.List className="max-h-[50vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[var(--border-subtle)]">
                <Command.Empty className="py-12 text-center text-[var(--secondary)] font-mono text-sm">
                  {searchQuery ? "No entries found in the archive." : "Type a query to search the living archive."}
                </Command.Empty>

                {!searchQuery && (
                  <Command.Group heading="Destinations" className="text-xs font-mono text-[var(--secondary)] px-2 py-2">
                    <Command.Item onSelect={() => onSelect('/journal')} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--border-subtle)]/50 cursor-pointer text-sm text-[var(--foreground)] aria-selected:bg-[var(--accent)]/10 aria-selected:text-[var(--accent)] transition-colors">
                      <Clock className="w-4 h-4" /> Living Timeline
                    </Command.Item>
                    <Command.Item onSelect={() => onSelect('/journal/spatial-spark')} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--border-subtle)]/50 cursor-pointer text-sm text-[var(--foreground)] aria-selected:bg-[var(--accent)]/10 aria-selected:text-[var(--accent)] transition-colors">
                      <MapPin className="w-4 h-4" /> Atlas Map
                    </Command.Item>
                    <Command.Item onSelect={() => onSelect('/now')} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[var(--border-subtle)]/50 cursor-pointer text-sm text-[var(--foreground)] aria-selected:bg-[var(--accent)]/10 aria-selected:text-[var(--accent)] transition-colors">
                      <FileText className="w-4 h-4" /> The NOW Page
                    </Command.Item>
                  </Command.Group>
                )}

                {/* Render results groups similarly... */}
                {['story', 'project', 'research', 'location', 'photo'].map(type => {
                  const filtered = results.filter(r => r.type === type);
                  if (filtered.length === 0) return null;
                  
                  const icons: Record<string, React.ElementType> = {
                    story: FileText,
                    project: Briefcase,
                    research: FlaskConical,
                    location: MapPin,
                    photo: Camera
                  };
                  const Icon = icons[type];
                  
                  return (
                    <Command.Group key={type} heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'} className="text-xs font-mono text-[var(--secondary)] px-2 py-2">
                      {filtered.map((item) => (
                        <Command.Item key={item.id} value={item.id} onSelect={() => onSelect(item.url)} className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-[var(--border-subtle)]/50 cursor-pointer aria-selected:bg-[var(--border-subtle)] transition-colors">
                          <Icon className="w-4 h-4 mt-0.5 text-[var(--accent)] shrink-0" />
                          <div className="flex flex-col">
                            <span className="text-sm font-sans text-[var(--foreground)]">{item.title}</span>
                            {(item.description || item.era) && <span className="text-xs text-[var(--secondary)] line-clamp-1 mt-0.5 font-mono">{item.description || item.era}</span>}
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )
                })}
              </Command.List>
              
              <div className="border-t border-[var(--border-subtle)] px-4 py-3 flex items-center justify-between text-[11px] font-mono text-[var(--secondary)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">↑</kbd>
                    <kbd className="bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-[var(--background)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">↵</kbd>
                    select
                  </span>
                </div>
                <span>Ask the Archive</span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
