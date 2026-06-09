import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Eye } from "lucide-react";
import { formatearPrecio } from "@/lib/utils";

export default async function AdminPropiedadesPage() {
  const propiedades = await prisma.propiedad.findMany({
    include: { barrio: { include: { departamento: true } } },
    orderBy: { creadaEn: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutro-900">Propiedades</h1>
        <Link href="/admin/propiedades/nueva" className="btn-primario flex items-center gap-2">
          <Plus size={16} /> Nueva propiedad
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutro-200 overflow-hidden">
        {propiedades.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutro-500 mb-4">No hay propiedades cargadas aún</p>
            <Link href="/admin/propiedades/nueva" className="btn-primario">
              Cargar primera propiedad
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutro-50 text-neutro-600 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Propiedad</th>
                <th className="px-4 py-3 font-medium">Zona</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutro-100">
              {propiedades.map(p => (
                <tr key={p.id} className="hover:bg-neutro-50">
                  <td className="px-4 py-3 font-mono text-xs text-neutro-500">{p.codigo}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutro-900 line-clamp-1">{p.titulo}</p>
                    <p className="text-xs text-neutro-500">{p.tipoPropiedad} · {p.tipoOperacion}</p>
                  </td>
                  <td className="px-4 py-3 text-neutro-600">
                    {p.barrio ? `${p.barrio.nombre}, ${p.barrio.departamento.nombre}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutro-900">
                    {formatearPrecio(p.precio, p.moneda)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.estado === "DISPONIBLE" ? "bg-green-100 text-green-700" :
                      p.estado === "RESERVADA" ? "bg-amber-100 text-amber-700" :
                      "bg-neutro-100 text-neutro-600"
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/propiedades/${p.slug}`} target="_blank"
                        className="p-1.5 rounded hover:bg-neutro-100 text-neutro-500 hover:text-neutro-900">
                        <Eye size={15} />
                      </Link>
                      <Link href={`/admin/propiedades/${p.id}/editar`}
                        className="p-1.5 rounded hover:bg-neutro-100 text-neutro-500 hover:text-neutro-900">
                        <Pencil size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
