import { prisma } from "@/lib/db";
import FormularioPropiedad from "@/components/admin/FormularioPropiedad";

export default async function NuevaPropiedadPage() {
  const [departamentos, amenities] = await Promise.all([
    prisma.departamento.findMany({ include: { barrios: true }, orderBy: { nombre: "asc" } }),
    prisma.amenity.findMany({ orderBy: { nombre: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutro-900 mb-6">Nueva propiedad</h1>
      <FormularioPropiedad departamentos={departamentos} amenities={amenities} />
    </div>
  );
}
