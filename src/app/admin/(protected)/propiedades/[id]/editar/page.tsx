import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import FormularioPropiedad from "@/components/admin/FormularioPropiedad";
import SubidaImagenes from "@/components/admin/SubidaImagenes";
import EliminarPropiedad from "@/components/admin/EliminarPropiedad";

interface Props { params: { id: string } }

export default async function EditarPropiedadPage({ params }: Props) {
  const [propiedad, departamentos, amenities] = await Promise.all([
    prisma.propiedad.findUnique({
      where: { id: params.id },
      include: {
        imagenes: { orderBy: { orden: "asc" } },
        amenities: true,
        barrio: { include: { departamento: true } },
      },
    }),
    prisma.departamento.findMany({ include: { barrios: true }, orderBy: { nombre: "asc" } }),
    prisma.amenity.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  if (!propiedad) notFound();

  const valores = {
    ...propiedad,
    amenities: propiedad.amenities.map(a => a.amenityId),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutro-900">Editar propiedad</h1>
          <p className="text-sm text-neutro-500 mt-0.5 font-mono">{propiedad.codigo}</p>
        </div>
        <EliminarPropiedad propiedadId={propiedad.id} />
      </div>

      {/* Imágenes primero */}
      <div className="bg-white rounded-xl border border-neutro-200 p-5 mb-6">
        <h2 className="font-semibold text-neutro-900 mb-4 pb-3 border-b border-neutro-100">
          Fotos de la propiedad
        </h2>
        <SubidaImagenes propiedadId={propiedad.id} imagenesIniciales={propiedad.imagenes} />
      </div>

      <FormularioPropiedad
        departamentos={departamentos}
        amenities={amenities}
        propiedadId={propiedad.id}
        valores={valores}
      />
    </div>
  );
}
