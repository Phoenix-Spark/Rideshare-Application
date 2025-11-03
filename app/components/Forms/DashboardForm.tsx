import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftSideRidePanelForm";

export default function Dashboard(userName: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.onload = () => {
      if (!mapRef.current || !window.L) return;

      const travisAFB: [number, number] = [38.2627, -121.9272];
      const bounds: LatLngBoundsExpression = [
        [38.23508, -121.97875],
        [38.28997, -121.88825],
      ];

      const map = window.L.map(mapRef.current, {
        center: travisAFB,
        zoom: 15,
        zoomControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 14,
        maxZoom: 18,
      });

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      map.fitBounds(bounds);
      mapInstanceRef.current = map;
    };

    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="absolute inset-0 z-0 w-full h-full"></div>
      <LeftSideRidePanelForm />

      <RightSideUserPanelForm userName={userName}/>
    </div>
  );
}
