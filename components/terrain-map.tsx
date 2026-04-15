"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker, MarkerContent, MapRoute, MapControls, TERRAIN_STYLE } from "@/components/ui/map";
import type { Expedition } from "@/lib/expeditions";

interface Props {
  expedition: Expedition;
}

export default function TerrainMap({ expedition }: Props) {
  const [key, setKey] = useState(expedition.id);

  useEffect(() => {
    setKey(expedition.id + "-map-" + Date.now());
  }, [expedition.id]);

  const start = expedition.routeCoordinates[0];
  const end = expedition.routeCoordinates[expedition.routeCoordinates.length - 1];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <Map
        key={key}
        style={TERRAIN_STYLE}
        center={[expedition.centerLng, expedition.centerLat]}
        zoom={expedition.mapZoom}
        attributionControl={{ compact: true }}
      >
        {/* Route line */}
        <MapRoute
          coordinates={expedition.routeCoordinates}
          color="#C8905A"
          width={4}
          opacity={0.95}
        />

        {/* Start marker */}
        <MapMarker longitude={start[0]} latitude={start[1]}>
          <MarkerContent>
            <RoutePin color="#4CAF50" label="A" />
          </MarkerContent>
        </MapMarker>

        {/* End marker */}
        <MapMarker longitude={end[0]} latitude={end[1]}>
          <MarkerContent>
            <RoutePin color="#EF5350" label="B" />
          </MarkerContent>
        </MapMarker>

        <MapControls position="bottom-right" showZoom showFullscreen />
      </Map>

      {/* Legend overlay */}
      <div className="absolute bottom-10 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <LegendItem color="#C8905A" label="Rota" />
        <LegendItem color="#4CAF50" label="Início" />
        <LegendItem color="#EF5350" label="Fim" />
      </div>

      {/* Attribution bar sits at bottom automatically */}
    </div>
  );
}

function RoutePin({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold"
      style={{
        width: 24,
        height: 24,
        background: color,
        fontSize: 11,
        boxShadow: `0 2px 8px ${color}80`,
        border: "2px solid white",
        transform: "translate(-50%, -50%)",
      }}
    >
      {label}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#0E0C0A]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-[#B2A89E]">
      <span className="w-3 h-0.5 rounded" style={{ background: color }} />
      {label}
    </div>
  );
}
