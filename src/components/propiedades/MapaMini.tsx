"use client";

import dynamic from "next/dynamic";

// Leaflet no soporta SSR — se carga solo en el cliente
const MapaLeaflet = dynamic(() => import("./MapaLeafletInterno"), { ssr: false });

interface Props {
  lat: number;
  lng: number;
  titulo: string;
  exacta: boolean;
}

export default function MapaMini(props: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-neutro-900 mb-3">Ubicación</h2>
      {!props.exacta && (
        <p className="text-xs text-neutro-500 mb-2">
          Se muestra la zona aproximada para proteger la privacidad del propietario.
        </p>
      )}
      <div className="rounded-xl overflow-hidden border border-neutro-200 h-64">
        <MapaLeaflet {...props} />
      </div>
    </div>
  );
}
