import { Suspense } from "react";
import FiltrosBusqueda from "@/components/propiedades/FiltrosBusqueda";
import ListadoPropiedades from "@/components/propiedades/ListadoPropiedades";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Propiedades",
  description: "Buscá propiedades en venta y alquiler en Mendoza con filtros por zona, precio y tipo.",
};

interface PageProps {
  searchParams: {
    operacion?: string;
    tipo?: string;
    departamento?: string;
    precioMin?: string;
    precioMax?: string;
    dormitorios?: string;
    pagina?: string;
  };
}

export default function PropiedadesPage({ searchParams }: PageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutro-900 mb-6">
        Propiedades en Mendoza
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-72 flex-shrink-0">
          <FiltrosBusqueda searchParams={searchParams} />
        </aside>
        <section className="flex-1">
          <Suspense fallback={<div className="text-center py-12">Cargando propiedades...</div>}>
            <ListadoPropiedades searchParams={searchParams} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
