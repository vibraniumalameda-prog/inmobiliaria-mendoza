"use client";

import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix del ícono de Leaflet con Webpack/Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  lat: number;
  lng: number;
  titulo: string;
  exacta: boolean;
}

export default function MapaLeafletInterno({ lat, lng, titulo, exacta }: Props) {
  return (
    <MapContainer center={[lat, lng]} zoom={exacta ? 16 : 14} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {exacta ? (
        <Marker position={[lat, lng]}>
          <Popup>{titulo}</Popup>
        </Marker>
      ) : (
        <Circle
          center={[lat, lng]}
          radius={400}
          pathOptions={{ color: "#ac2046", fillColor: "#ac2046", fillOpacity: 0.15 }}
        />
      )}
    </MapContainer>
  );
}
