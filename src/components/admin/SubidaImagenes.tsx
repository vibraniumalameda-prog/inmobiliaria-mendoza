"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Star } from "lucide-react";
import type { ImagenPropiedad } from "@prisma/client";

interface Props {
  propiedadId: string;
  imagenesIniciales?: ImagenPropiedad[];
}

export default function SubidaImagenes({ propiedadId, imagenesIniciales = [] }: Props) {
  const [imagenes, setImagenes] = useState<ImagenPropiedad[]>(imagenesIniciales);
  const [subiendo, setSubiendo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleArchivos(files: FileList) {
    setSubiendo(true);
    for (const file of Array.from(files)) {
      // 1. Subir a Cloudinary via nuestra API
      const formData = new FormData();
      formData.append("file", file);
      const upRes = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!upRes.ok) continue;
      const { url, urlThumb } = await upRes.json();

      // 2. Guardar en DB
      const esPrincipal = imagenes.length === 0;
      const dbRes = await fetch(`/api/admin/propiedades/${propiedadId}/imagenes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, urlThumb, esPrincipal }),
      });
      if (!dbRes.ok) continue;
      const nueva = await dbRes.json();
      setImagenes(prev => [...prev, nueva]);
    }
    setSubiendo(false);
  }

  async function eliminar(imagenId: number) {
    await fetch(`/api/admin/propiedades/${propiedadId}/imagenes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagenId }),
    });
    setImagenes(prev => prev.filter(i => i.id !== imagenId));
  }

  async function marcarPrincipal(imagenId: number) {
    await fetch(`/api/admin/propiedades/${propiedadId}/imagenes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: imagenes.find(i => i.id === imagenId)!.url,
        urlThumb: imagenes.find(i => i.id === imagenId)!.urlThumb,
        esPrincipal: true,
      }),
    });
    setImagenes(prev => prev.map(i => ({ ...i, esPrincipal: i.id === imagenId })));
  }

  return (
    <div className="space-y-4">
      {/* Zona de drop */}
      <div
        className="border-2 border-dashed border-neutro-300 rounded-xl p-8 text-center cursor-pointer hover:border-marca-700 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleArchivos(e.dataTransfer.files); }}
      >
        <Upload size={32} className="mx-auto text-neutro-400 mb-2" />
        <p className="text-sm text-neutro-600">
          {subiendo ? "Subiendo imágenes..." : "Arrastrá fotos aquí o hacé click para seleccionar"}
        </p>
        <p className="text-xs text-neutro-400 mt-1">JPG, PNG, WEBP — máx. 10MB por imagen</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && handleArchivos(e.target.files)}
        />
      </div>

      {/* Grilla de imágenes */}
      {imagenes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {imagenes.map(img => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-neutro-200 aspect-[4/3]">
              <Image src={img.urlThumb} alt="" fill className="object-cover" />

              {img.esPrincipal && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  Principal
                </span>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.esPrincipal && (
                  <button onClick={() => marcarPrincipal(img.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-full" title="Marcar como principal">
                    <Star size={14} />
                  </button>
                )}
                <button onClick={() => eliminar(img.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
