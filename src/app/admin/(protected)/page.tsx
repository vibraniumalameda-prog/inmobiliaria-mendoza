import { prisma } from "@/lib/db";
import { Building2, Eye, MessageSquare, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [totalPropiedades, disponibles, consultas, visitas] = await Promise.all([
    prisma.propiedad.count(),
    prisma.propiedad.count({ where: { estado: "DISPONIBLE" } }),
    prisma.consulta.count({ where: { leida: false } }),
    prisma.visita.count({
      where: { visitadaEn: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  const ultimasPropiedades = await prisma.propiedad.findMany({
    orderBy: { creadaEn: "desc" },
    take: 5,
    select: { id: true, titulo: true, estado: true, tipoOperacion: true, creadaEn: true },
  });

  const stats = [
    { label: "Total propiedades", value: totalPropiedades, icon: Building2, color: "text-marca-700" },
    { label: "Disponibles", value: disponibles, icon: TrendingUp, color: "text-green-600" },
    { label: "Consultas sin leer", value: consultas, icon: MessageSquare, color: "text-amber-600" },
    { label: "Visitas (7 días)", value: visitas, icon: Eye, color: "text-blue-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutro-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-neutro-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutro-500">{label}</p>
              <Icon size={18} className={color} />
            </div>
            <p className="text-3xl font-bold text-neutro-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Últimas propiedades */}
      <div className="bg-white rounded-xl border border-neutro-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-neutro-100">
          <h2 className="font-semibold text-neutro-900">Últimas propiedades cargadas</h2>
        </div>
        {ultimasPropiedades.length === 0 ? (
          <p className="text-center text-neutro-500 text-sm py-8">Aún no hay propiedades cargadas</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutro-50 text-neutro-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Propiedad</th>
                <th className="text-left px-5 py-3 font-medium">Operación</th>
                <th className="text-left px-5 py-3 font-medium">Estado</th>
                <th className="text-left px-5 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutro-100">
              {ultimasPropiedades.map(p => (
                <tr key={p.id} className="hover:bg-neutro-50">
                  <td className="px-5 py-3 font-medium text-neutro-900">{p.titulo}</td>
                  <td className="px-5 py-3 text-neutro-600">{p.tipoOperacion}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.estado === "DISPONIBLE" ? "bg-green-100 text-green-700" :
                      p.estado === "RESERVADA" ? "bg-amber-100 text-amber-700" :
                      "bg-neutro-100 text-neutro-600"
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-neutro-500">
                    {new Date(p.creadaEn).toLocaleDateString("es-AR")}
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
