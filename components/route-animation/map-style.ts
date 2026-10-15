// Estilo do mapa: satélite Mapbox (raster), sem rótulos, com névoa leve.
// Sem token, cai num fundo de areia liso: a animação continua funcionando,
// só sem a imagem de satélite.

import type { StyleSpecification } from "maplibre-gl";

/** Zoom máximo pedido à fonte; acima disso o MapLibre amplia o tile de 15. */
export const SATELLITE_MAX_ZOOM = 15;

const SAND = "#DCCFB0";

const ATTRIBUTION =
  '© <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener">Mapbox</a> ' +
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> ' +
  '<a href="https://apps.mapbox.com/feedback/" target="_blank" rel="noopener">Melhore este mapa</a> ' +
  "© Maxar";

export function buildMapStyle(token: string | undefined): StyleSpecification {
  const background = {
    id: "areia",
    type: "background" as const,
    paint: { "background-color": SAND },
  };
  const sky = {
    "sky-color": "#2B3A55",
    "horizon-color": "#E8DFC9",
    "fog-color": "#E3D8C0",
    "fog-ground-blend": 0.75,
    "horizon-fog-blend": 0.6,
    "sky-horizon-blend": 0.6,
    "atmosphere-blend": 0,
  };
  if (!token) return { version: 8, sources: {}, layers: [background], sky };
  return {
    version: 8,
    sources: {
      satelite: {
        type: "raster",
        tiles: [`https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=${token}`],
        tileSize: 512,
        maxzoom: SATELLITE_MAX_ZOOM,
        attribution: ATTRIBUTION,
      },
    },
    layers: [
      background,
      {
        id: "satelite",
        type: "raster",
        source: "satelite",
        paint: {
          "raster-saturation": -0.15,
          "raster-contrast": 0.05,
          "raster-fade-duration": 0,
        },
      },
    ],
    sky,
  };
}
