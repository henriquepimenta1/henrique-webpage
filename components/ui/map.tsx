"use client";

import MapLibreGL from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Locate, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Terrain / topo style (Esri World Topo — free, no API key) ──────────────
export const TERRAIN_STYLE: MapLibreGL.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    topo: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Tiles &copy; Esri",
      maxzoom: 18,
    },
  },
  layers: [{ id: "topo-layer", type: "raster", source: "topo" }],
};

// Natural-earth style for the world-globe overview
export const WORLD_STYLE: MapLibreGL.StyleSpecification = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    world: {
      type: "raster",
      tiles: [
        "https://basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "&copy; CARTO",
      maxzoom: 20,
    },
  },
  layers: [{ id: "world-layer", type: "raster", source: "world" }],
};

// ── Context ────────────────────────────────────────────────────────────────
type MapContextValue = { map: MapLibreGL.Map | null; isLoaded: boolean };
const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be inside <Map>");
  return ctx;
}

// ── Map ────────────────────────────────────────────────────────────────────
type MapProps = {
  children?: ReactNode;
  style?: MapLibreGL.StyleSpecification | string;
} & Omit<MapLibreGL.MapOptions, "container" | "style">;

const DefaultLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#0E0C0A]">
    <div className="flex gap-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="size-1.5 rounded-full bg-[#746A62] animate-pulse"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </div>
  </div>
);

export function Map({ children, style, ...props }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreGL.Map | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  const mapStyle = style ?? TERRAIN_STYLE;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted || !containerRef.current) return;
    const m = new MapLibreGL.Map({
      container: containerRef.current,
      style: mapStyle as MapLibreGL.StyleSpecification,
      attributionControl: { compact: true },
      ...props,
    });
    const onLoad = () => setIsLoaded(true);
    const onStyle = () => setIsStyleLoaded(true);
    m.on("load", onLoad);
    m.on("styledata", onStyle);
    mapRef.current = m;
    return () => {
      m.off("load", onLoad);
      m.off("styledata", onStyle);
      m.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const isLoading = !isMounted || !isLoaded || !isStyleLoaded;

  return (
    <MapContext.Provider value={{ map: mapRef.current, isLoaded: isMounted && isLoaded && isStyleLoaded }}>
      <div ref={containerRef} className="relative w-full h-full">
        {isLoading && <DefaultLoader />}
        {isMounted && children}
      </div>
    </MapContext.Provider>
  );
}

// ── Marker ─────────────────────────────────────────────────────────────────
type MarkerContextValue = {
  markerRef: React.RefObject<MapLibreGL.Marker | null>;
  markerElementRef: React.RefObject<HTMLDivElement | null>;
  map: MapLibreGL.Map | null;
  isReady: boolean;
};
const MarkerContext = createContext<MarkerContextValue | null>(null);
function useMarkerContext() {
  const ctx = useContext(MarkerContext);
  if (!ctx) throw new Error("Marker components must be inside MapMarker");
  return ctx;
}

type MapMarkerProps = {
  longitude: number;
  latitude: number;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
};

export function MapMarker({ longitude, latitude, children, onClick }: MapMarkerProps) {
  const { map, isLoaded } = useMap();
  const markerRef = useRef<MapLibreGL.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoaded || !map) return;
    const el = document.createElement("div");
    markerElementRef.current = el;
    const marker = new MapLibreGL.Marker({ element: el })
      .setLngLat([longitude, latitude])
      .addTo(map);
    markerRef.current = marker;
    if (onClick) el.addEventListener("click", onClick);
    setIsReady(true);
    return () => {
      if (onClick) el.removeEventListener("click", onClick);
      marker.remove();
      markerRef.current = null;
      markerElementRef.current = null;
      setIsReady(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isLoaded]);

  useEffect(() => {
    markerRef.current?.setLngLat([longitude, latitude]);
  }, [longitude, latitude]);

  return (
    <MarkerContext.Provider value={{ markerRef, markerElementRef, map, isReady }}>
      {children}
    </MarkerContext.Provider>
  );
}

type MarkerContentProps = { children?: ReactNode; className?: string };
export function MarkerContent({ children, className }: MarkerContentProps) {
  const { markerElementRef, isReady } = useMarkerContext();
  if (!isReady || !markerElementRef.current) return null;
  return createPortal(
    <div className={cn("relative cursor-pointer", className)}>{children}</div>,
    markerElementRef.current
  );
}

// ── Route line ─────────────────────────────────────────────────────────────
type MapRouteProps = {
  coordinates: [number, number][];
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: number[];
};

export function MapRoute({
  coordinates,
  color = "#C8905A",
  width = 3,
  opacity = 0.9,
  dashArray,
}: MapRouteProps) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `route-src-${id}`;
  const layerId = `route-layer-${id}`;

  useEffect(() => {
    if (!isLoaded || !map) return;
    map.addSource(sourceId, {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
    });
    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": color,
        "line-width": width,
        "line-opacity": opacity,
        ...(dashArray ? { "line-dasharray": dashArray } : {}),
      },
    });
    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, map]);

  useEffect(() => {
    if (!isLoaded || !map || coordinates.length < 2) return;
    const src = map.getSource(sourceId) as MapLibreGL.GeoJSONSource | undefined;
    src?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    });
  }, [isLoaded, map, coordinates, sourceId]);

  return null;
}

// ── Controls ───────────────────────────────────────────────────────────────
type MapControlsProps = {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  showZoom?: boolean;
  showLocate?: boolean;
  showFullscreen?: boolean;
  className?: string;
};

const ctrlPos: Record<string, string> = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-8 right-2",
};

function CtrlGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col rounded border border-white/10 bg-[#141210]/90 backdrop-blur-md shadow overflow-hidden [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-white/10">
      {children}
    </div>
  );
}
function CtrlBtn({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center size-8 hover:bg-white/10 transition-colors text-[#B2A89E]"
    >
      {children}
    </button>
  );
}

export function MapControls({ position = "bottom-right", showZoom = true, showLocate = false, showFullscreen = false, className }: MapControlsProps) {
  const { map, isLoaded } = useMap();
  const [locating, setLocating] = useState(false);
  const zoomIn = useCallback(() => map?.zoomTo((map.getZoom() ?? 10) + 1, { duration: 300 }), [map]);
  const zoomOut = useCallback(() => map?.zoomTo((map.getZoom() ?? 10) - 1, { duration: 300 }), [map]);
  const locate = useCallback(() => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        map?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 });
        setLocating(false);
      },
      () => setLocating(false)
    );
  }, [map]);
  const fullscreen = useCallback(() => {
    const el = map?.getContainer();
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }, [map]);
  if (!isLoaded) return null;
  return (
    <div className={cn("absolute z-10 flex flex-col gap-1.5", ctrlPos[position], className)}>
      {showZoom && (
        <CtrlGroup>
          <CtrlBtn onClick={zoomIn} label="Zoom in"><Plus className="size-3.5" /></CtrlBtn>
          <CtrlBtn onClick={zoomOut} label="Zoom out"><Minus className="size-3.5" /></CtrlBtn>
        </CtrlGroup>
      )}
      {showLocate && (
        <CtrlGroup>
          <CtrlBtn onClick={locate} label="My location">
            {locating ? <Loader2 className="size-3.5 animate-spin" /> : <Locate className="size-3.5" />}
          </CtrlBtn>
        </CtrlGroup>
      )}
      {showFullscreen && (
        <CtrlGroup>
          <CtrlBtn onClick={fullscreen} label="Fullscreen"><Maximize className="size-3.5" /></CtrlBtn>
        </CtrlGroup>
      )}
    </div>
  );
}
