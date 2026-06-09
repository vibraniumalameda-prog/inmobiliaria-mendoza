import { prisma } from "@/lib/db";
import TarjetaPropiedad from "@/components/propiedades/TarjetaPropiedad";
import type { Propiedad, ImagenPropiedad, Barrio, Departamento } from "@prisma/client";

type PropiedadConRelaciones = Propiedad & {
  imagenes: ImagenPropiedad[];
  barrio: (Barrio & { departamento: Departamento }) | null;
};

export default async function PropiedadesDestacadas() {
  let propiedades: PropiedadConRelaciones[] = [];

  try {
    propiedades = await prisma.propiedad.findMany({
      where: { destacada: true, estado: "DISPONIBLE" },
      include: {
        imagenes: { orderBy: { orden: "asc" }, take: 1 },
        barrio: { include: { departamento: true } },
      },
      orderBy: { publicadaEn: "desc" },
      take: 6,
    }) as PropiedadConRelaciones[];
  } catch {
    return null;
  }

  if (propiedades.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <h2 className="text-2xl font-bold text-neutro-900 mb-6">Propiedades destacadas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {propiedades.map(p => (
          <TarjetaPropiedad key={p.id} propiedad={p} />
        ))}
      </div>
    </section>
  );
}
