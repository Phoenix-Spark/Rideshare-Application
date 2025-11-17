import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import type { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";

export default function MapDisplay({ user, station }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize map ONCE (no dependencies except setup)
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    
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
      console.log("map initialized");
    };

    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency - runs once on mount

  // Update markers ONLY when station changes
  // Update markers ONLY when station changes
// Update markers ONLY when station changes
useEffect(() => {
      if (!mapInstanceRef.current || !window.L) return;
    
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    
      // Add new markers
      station.filter(loc => loc.id !== (searchParams.get("dropoffId") || searchParams.get('pickupId'))).forEach((location, index) => {
        
        const marker = window.L.marker([
          location.latitude,
          location.longitude,
        ]).addTo(mapInstanceRef.current!);
    
        // Create a DOM element for the popup
        const popupDiv = document.createElement("div");
        popupDiv.style.cursor = "pointer";
        popupDiv.style.padding = "8px";
        popupDiv.style.minWidth = "100px";
        popupDiv.style.textAlign = "center";
        popupDiv.innerHTML = `
            <b>${location.name}</b><br/>
            <small>${location.description}</small><br/>
            <button class="bg-blue-500 rounded-lg p-2 hover:bg-blue-400 text-white mt-2">Test</button>
            `;
        const button = popupDiv.querySelector("button");
        if (button) {
          button.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Button clicked!");
          });
        }
        
        // Add click handler directly to the div
        popupDiv.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent event bubbling

          setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            const dest = params.get("showmap")
            params.set(dest === "pickup" ? "pickupId" : "dropoffId", location.id);
            params.delete("showmap")
            return params;
          });
        });
    
        // Bind the popup with the DOM element
        marker.bindPopup(popupDiv);

        marker.on('click', function() {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(
                [location.latitude, location.longitude], 
                19,
                { duration: 2 }
              );
            }
          });

        markersRef.current.push(marker);
      });
    }, [station, setSearchParams]);

  return (
    <>
      {user.baseId ? (
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-1" />
      ) : (
        <div className="absolute inset-0 w-full h-full z-0 bg-white"></div>
      )}
    </>
  );
}