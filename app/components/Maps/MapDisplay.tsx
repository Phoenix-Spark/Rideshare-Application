import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapDisplay({ user, station }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [parseFloat(user.base.long), parseFloat(user.base.lat)],
      zoom: 14,
    });

    mapInstanceRef.current = map;

    map.on("click", (e) => {
      markersRef.current.forEach((marker) => {
        const popup = marker.getPopup();
        if (popup && popup.isOpen()) {
          popup.remove();
        }
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [user.base.long, user.base.lat]);

  useEffect(() => {
    if (!mapInstanceRef.current || !station) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    station.forEach((loc: any) => {
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
        `
        <div class="text-center p-2 text-black">
          <h3 class="text-lg font-bold">${loc.name}</h3>
          <p class="max-w-40 text-md">${loc.description || ""}</p>
        </div>
        `
      );

      const marker = new maplibregl.Marker({ color: "#ef4444" })
        .setLngLat([parseFloat(loc.longitude), parseFloat(loc.latitude)])
        .setPopup(popup)
        .addTo(mapInstanceRef.current!);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [station]);

  return <div ref={mapRef} className="relative w-screen h-screen" />;
}
