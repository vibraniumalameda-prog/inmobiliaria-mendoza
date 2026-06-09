import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import GaleriaImagenes from "@/components/propiedades/GaleriaImagenes";
import MapaMini from "@/components/propiedades/MapaMini";
import FormularioConsulta from "@/components/propiedades/FormularioConsulta";
import { formatearPrecio } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const propiedad = await prisma.propiedad.findUnique({
    where: { slug: params.slug },
    select: { titulo: true, metaDescripcion: true },
  });
  if (!propiedad) return {};
  return {
    title: propiedad.titulo,
    description: propiedad.metaDescripcion ?? propiedad.titulo,
  };
}

export default async function PropiedadDetallePage({ params }: PageProps) {
  const propiedad = await prisma.propiedad.findUnique({
    where: { slug: params.slug },
    include: {
      imagenes: { orderBy: { orden: "asc" } },
      amenities: { include: { amenity: true } },
      barrio: { include: { departamento: true } },
      agente: { select: { nombre: true, apellido: true, telefono: true, fotoPerfil: true } },
    },
  });

  if (!propiedad) notFound();

  // Registrar visita (fire & forget)
  prisma.visita.create({ data: { propiedadId: propiedad.id } }).catch(() => {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <GaleriaImagenes imagenes={propiedad.imagenes} titulo={propiedad.titulo} />

          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-neutro-900">{propiedad.titulo}</h1>
              <span className="text-2xl font-bold text-marca-700 whitespace-nowrap">
                {formatearPrecio(propiedad.precio, propiedad.moneda)}
              </span>
            </div>
            {propiedad.barrio && (
              <p className="text-neutro-500 mt-1">
                {propiedad.barrio.nombre}, {propiedad.barrio.departamento.nombre}
              </p>
            )}
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {propiedad.superficieCubierta && (
              <Stat label="Sup. cubierta" value={`${propiedad.superficieCubierta} m²`} />
            )}
            {propiedad.superficieTotal && (
              <Stat label="Sup. total" value={`${propiedad.superficieTotal} m²`} />
            )}
            {propiedad.dormitorios && (
              <Stat label="Dormitorios" value={String(propiedad.dormitorios)} />
            )}
            {propiedad.banos && (
              <Stat label="Baños" value={String(propiedad.banos)} />
            )}
            {propiedad.cocheras != null && propiedad.cocheras > 0 && (
              <Stat label="Cocheras" value={String(propiedad.cocheras)} />
            )}
            {propiedad.antiguedad != null && (
              <Stat label="Antigüedad" value={`${propiedad.antiguedad} años`} />
            )}
          </div>

          {/* Descripción */}
          <div className="prose max-w-none text-neutro-700">
            <h2 className="text-lg font-semibold text-neutro-900">Descripción</h2>
            <p className="whitespace-pre-line">{propiedad.descripcion}</p>
          </div>

          {/* Amenities */}
          {propiedad.amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutro-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {propiedad.amenities.map(({ amenity }) => (
                  <span key={amenity.id} className="bg-neutro-100 text-neutro-700 text-sm px-3 py-1 rounded-full">
                    {amenity.nombre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Mapa */}
          {propiedad.latitud && propiedad.longitud && (
            <MapaMini
              lat={Number(propiedad.latitud)}
              lng={Number(propiedad.longitud)}
              titulo={propiedad.titulo}
              exacta={propiedad.mostrarDireccionExacta}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Datos agente */}
          <div className="tarjeta p-4">
            <p className="font-semibold text-neutro-900">
              {propiedad.agente.nombre} {propiedad.agente.apellido}
            </p>
            <p className="text-sm text-neutro-500 mb-3">Agente inmobiliario</p>
            {propiedad.agente.telefono && (
              <a
                href={`https://wa.me/${propiedad.agente.telefono.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primario w-full text-center block"
              >
                Consultar por WhatsApp
              </a>
            )}
          </div>

          {/* Formulario consulta */}
          <FormularioConsulta propiedadId={propiedad.id} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="tarjeta p-3 text-center">
      <p className="text-xs text-neutro-500">{label}</p>
      <p className="font-semibold text-neutro-900 mt-0.5">{value}</p>
    </div>
  );
}
