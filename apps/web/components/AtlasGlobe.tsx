"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Map, { Marker, Source, Layer, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion } from "framer-motion";
import { JournalEntry } from "./AtlasArchive";

interface AtlasGlobeProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (id: string) => void;
}

const CATEGORY_COLORS = {
  Travel: "#FFD700", // Gold
  Thoughts: "#FFFFF0", // Ivory
  "Current Affairs": "#3B5BDB", // Blue
  Reflections: "#FFBF00", // Amber
  Photography: "#C0C0C0", // Silver
};

export function AtlasGlobe({ entries, selectedEntryId, onSelectEntry }: AtlasGlobeProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
    pitch: 30,
    bearing: 0,
  });

  // Handle Idle Rotation
  const [isIdle, setIsIdle] = useState(true);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleInteractionStart = () => {
    setIsIdle(false);
    if (idleTimeout.current) clearTimeout(idleTimeout.current);
  };

  const handleInteractionEnd = () => {
    idleTimeout.current = setTimeout(() => setIsIdle(true), 3000);
  };

  useEffect(() => {
    if (!isIdle || selectedEntryId) return;
    
    let animationId: number;
    const rotate = () => {
      setViewState((prev) => ({
        ...prev,
        longitude: prev.longitude + 0.1, // extremely slow rotation
      }));
      animationId = requestAnimationFrame(rotate);
    };
    animationId = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(animationId);
  }, [isIdle, selectedEntryId]);

  // Fly to selected entry
  useEffect(() => {
    if (selectedEntryId && mapRef.current) {
      const entry = entries.find((e) => e.id === selectedEntryId);
      if (entry) {
        mapRef.current.flyTo({
          center: entry.coordinates,
          zoom: 4,
          pitch: 45,
          speed: 0.8,
          curve: 1.5,
          essential: true,
        });
      }
    }
  }, [selectedEntryId, entries]);

  // Animated connection line from current center to target
  // (Simplified as a GeoJSON line for visual flair)
  const lineData = useMemo(() => {
    if (!selectedEntryId) return null;
    const target = entries.find((e) => e.id === selectedEntryId)?.coordinates;
    if (!target) return null;
    
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            // A curved arc across the globe
            coordinates: [
              [viewState.longitude, viewState.latitude],
              target
            ]
          },
          properties: {}
        }
      ]
    };
  }, [selectedEntryId, entries, viewState.longitude, viewState.latitude]);

  return (
    <div className="w-full h-full relative bg-[#0b0d0f] overflow-hidden">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onDragStart={handleInteractionStart}
        onDragEnd={handleInteractionEnd}
        onZoomStart={handleInteractionStart}
        onZoomEnd={handleInteractionEnd}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        projection={{ name: "globe" }}
        fog={{
          range: [0.5, 10],
          color: "rgba(255, 255, 255, 0.05)",
          "high-color": "rgba(0, 0, 0, 0.9)",
          "space-color": "rgb(11, 13, 15)",
          "star-intensity": 0.5,
        }}
      >
        {/* Dynamic Glowing Connection Line */}
        {lineData && (
          <Source type="geojson" data={lineData}>
            <Layer 
              id="flight-path" 
              type="line" 
              paint={{
                "line-color": "#FFD700",
                "line-width": 2,
                "line-opacity": 0.4,
              }} 
            />
          </Source>
        )}

        {/* Memory Pins */}
        {entries.map((entry) => {
          const isSelected = selectedEntryId === entry.id;
          const color = CATEGORY_COLORS[entry.category] || "#FFF";

          return (
            <Marker
              key={entry.id}
              longitude={entry.coordinates[0]}
              latitude={entry.coordinates[1]}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelectEntry(entry.id);
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isSelected ? 1.5 : 1 }}
                className="relative group cursor-pointer"
              >
                {/* Glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: color }}
                />
                {/* Pin Head */}
                <div 
                  className="w-3 h-3 rounded-full relative z-10 border border-black/50"
                  style={{ backgroundColor: color }}
                />
                
                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col items-center">
                  <div className="bg-[#1a1a1a]/90 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#333] shadow-2xl flex flex-col items-center gap-1">
                    <span className="font-heading text-lg text-white leading-none">{entry.location}</span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#888]">{entry.date}</span>
                  </div>
                  <div className="w-2 h-2 bg-[#1a1a1a]/90 border-r border-b border-[#333] rotate-45 -mt-1" />
                </div>
              </motion.div>
            </Marker>
          );
        })}
      </Map>

      {/* Ambient Audio Toggle placeholder */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-[#1a1a1a]/80 backdrop-blur-md border border-[#333] text-[#888] hover:text-white flex items-center justify-center transition-colors">
          🔊
        </button>
      </div>
    </div>
  );
}
