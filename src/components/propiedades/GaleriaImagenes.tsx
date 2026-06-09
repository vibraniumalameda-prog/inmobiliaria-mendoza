"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ImagenPropiedad } from "@prisma/client";

export default function GaleriaImagenes({ imagenes, titulo }: { imagenes: ImagenPropiedad[]; titulo: string }) {
  const [actual, setActual] = useState(0);

  if (imagenes.length === 0) {
    return <div className="aspect-video bg-neutro-100 rounded-xl flex items-center justify-center text-neutro-400">Sin imágenes</div>;
  }

  const anterior = () => setActual(i => (i - 1 + imagenes.length) % imagenes.length);
  const siguiente = () => setActual(i => (i + 1) % imagenes.length);

  return (
    <div className="space-y-3">
      {/* Imagen principal */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutro-100">
        <Image
          src={imagenes[actual].url}
          alt={imagenes[actual].altText ?? titulo}
          fill
          className="object-cover"
          priority
        />
        {imagenes.length > 1 && (
          <>
            <button onClick={anterior} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={siguiente} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors">
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {actual + 1} / {imagenes.length}
            </span>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActual(i)}
              className={`relative w-16 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === actual ? "border-marca-700" : "border-transparent"
              }`}
            >
              <Image src={img.urlThumb} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
