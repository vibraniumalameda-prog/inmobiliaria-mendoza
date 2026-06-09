import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Car, Maximize2 } from "lucide-react";
import { formatearPrecio } from "@/lib/utils";
import type { Propiedad, ImagenPropiedad, Barrio, Departamento } from "@prisma/client";

type PropiedadConRelaciones = Propiedad & {
  imagenes: ImagenPropiedad[];
  barrio: (Barrio & { departamento: Departamento }) | null;
};

export default function TarjetaPropiedad({ propiedad }: { propiedad: PropiedadConRelaciones }) {
  const imagen = propiedad.imagenes.find(i => i.esPrincipal) ?? propiedad.imagenes[0];

  return (
    <Link href={`/propiedades/${propiedad.slug}`} className="tarjeta hover:shadow-md transition-shadow group block">
      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-neutro-100 overflow-hidden">
        {imagen ? (
          <Image
            src={imagen.urlThumb}
            alt={imagen.altText ?? propiedad.titulo}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutro-300 text-sm">
            Sin imagen
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-marca-700 text-white text-xs font-semibold px-2 py-1 rounded">
            {propiedad.tipoOperacion === "VENTA" ? "Venta"
              : propiedad.tipoOperacion === "ALQUILER" ? "Alquiler"
              : "Temporario"}
          </span>
          {propiedad.destacada && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Destacada
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-bold text-lg text-marca-700">
          {formatearPrecio(propiedad.precio, propiedad.moneda)}
        </p>
        <h3 className="font-semibold text-neutro-900 mt-1 line-clamp-2 text-sm">
          {propiedad.titulo}
        </h3>
        {propiedad.barrio && (
          <p className="text-xs text-neutro-500 mt-1">
            {propiedad.barrio.nombre}, {propiedad.barrio.departamento.nombre}
          </p>
        )}

        {/* Iconos características */}
        <div className="flex items-center gap-3 mt-3 text-xs text-neutro-600 border-t border-neutro-100 pt-3">
          {propiedad.dormitorios && (
            <span className="flex items-center gap-1">
              <BedDouble size={14} /> {propiedad.dormitorios}
            </span>
          )}
          {propiedad.banos && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> {propiedad.banos}
            </span>
          )}
          {propiedad.cocheras != null && propiedad.cocheras > 0 && (
            <span className="flex items-center gap-1">
              <Car size={14} /> {propiedad.cocheras}
            </span>
          )}
          {propiedad.superficieCubierta && (
            <span className="flex items-center gap-1">
              <Maximize2 size={14} /> {Number(propiedad.superficieCubierta)} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
