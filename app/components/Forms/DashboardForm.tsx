import { useEffect, useRef } from "react";
import type { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import RightSideUserPanelForm from "./RightSideUserPanelForm";
import LeftSideRidePanelForm from "./LeftRidePanelForm";
import { Outlet } from "react-router";
import MiddlePanelForm from "./MiddlePanelForm";

export default function Dashboard({ user, station, accepted, activeRequests, requestInfo }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  console.log(station)

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

      station.forEach((location) => {
        const marker = window.L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(`<b>${location.name}</b>`);

        markersRef.current.push(marker);
      });
    };

    document.body.appendChild(script);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [station]);

  return (
    <div className="relative w-full h-screen">
      {user.baseId ? <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" /> : <div className="absolute inset-0 w-full h-full z-0 bg-white"></div>}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-4xl">
        <MiddlePanelForm user={user}/>
      </div>

      <div className="absolute top-0 left-0 h-full z-10">
        <LeftSideRidePanelForm 
          user={user} 
          station={station}
          accepted={accepted}
          activeRequests={activeRequests} 
          requestInfo={requestInfo}
        />
      </div>

      <div className="hidden md:block absolute top-0 right-0 h-full z-10">
        <RightSideUserPanelForm user={user} />
      </div>
      <Outlet />
    </div>
  );
}

