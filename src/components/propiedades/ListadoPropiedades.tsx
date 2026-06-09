import { prisma } from "@/lib/db";
import TarjetaPropiedad from "./TarjetaPropiedad";
import type { TipoOperacion, TipoPropiedad, Propiedad, ImagenPropiedad, Barrio, Departamento } from "@prisma/client";

type PropiedadConRelaciones = Propiedad & {
  imagenes: ImagenPropiedad[];
  barrio: (Barrio & { departamento: Departamento }) | null;
};

const POR_PAGINA = 12;

interface Props {
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

export default async function ListadoPropiedades({ searchParams }: Props) {
  const pagina = Number(searchParams.pagina ?? 1);
  const skip = (pagina - 1) * POR_PAGINA;

  const where = {
    estado: "DISPONIBLE" as const,
    ...(searchParams.operacion && { tipoOperacion: searchParams.operacion as TipoOperacion }),
    ...(searchParams.tipo && { tipoPropiedad: searchParams.tipo as TipoPropiedad }),
    ...(searchParams.departamento && {
      barrio: { departamento: { nombre: searchParams.departamento } },
    }),
    ...(searchParams.precioMin || searchParams.precioMax ? {
      precio: {
        ...(searchParams.precioMin && { gte: Number(searchParams.precioMin) }),
        ...(searchParams.precioMax && { lte: Number(searchParams.precioMax) }),
      },
    } : {}),
    ...(searchParams.dormitorios && { dormitorios: { gte: Number(searchParams.dormitorios) } }),
  };

  let propiedades: PropiedadConRelaciones[] = [];
  let total = 0;

  try {
    const resultado = await Promise.all([
      prisma.propiedad.findMany({
        where,
        include: {
          imagenes: { orderBy: { orden: "asc" }, take: 1 },
          barrio: { include: { departamento: true } },
        },
        orderBy: [{ destacada: "desc" }, { publicadaEn: "desc" }],
        skip,
        take: POR_PAGINA,
      }),
      prisma.propiedad.count({ where }),
    ]);
    propiedades = resultado[0] as PropiedadConRelaciones[];
    total = resultado[1];
  } catch {
    return (
      <div className="text-center py-16 text-neutro-500">
        <p className="text-lg font-medium">Base de datos no disponible</p>
        <p className="text-sm mt-1">Instalá PostgreSQL para ver las propiedades.</p>
      </div>
    );
  }

  if (propiedades.length === 0) {
    return (
      <div className="text-center py-16 text-neutro-500">
        <p className="text-lg font-medium">No encontramos propiedades</p>
        <p className="text-sm mt-1">Probá con otros filtros</p>
      </div>
    );
  }

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div>
      <p className="text-sm text-neutro-500 mb-4">{total} propiedades encontradas</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {propiedades.map(p => (
          <TarjetaPropiedad key={p.id} propiedad={p} />
        ))}
      </div>

      {/* Paginación simple */}
      {totalPaginas > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...searchParams, pagina: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                p === pagina
                  ? "bg-marca-700 text-white border-marca-700"
                  : "border-neutro-300 text-neutro-700 hover:border-marca-700 hover:text-marca-700"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
