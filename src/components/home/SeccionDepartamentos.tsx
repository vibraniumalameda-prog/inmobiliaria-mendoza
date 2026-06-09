import Link from "next/link";

const DEPARTAMENTOS = [
  { nombre: "Capital",       emoji: "🏙️", desc: "Centro y barrios" },
  { nombre: "Godoy Cruz",    emoji: "🏘️", desc: "Cerca del centro" },
  { nombre: "Guaymallén",    emoji: "🌿", desc: "Gran variedad" },
  { nombre: "Luján de Cuyo", emoji: "🍷", desc: "Zona bodeguera" },
  { nombre: "Maipú",         emoji: "🌾", desc: "Viñedos y campo" },
  { nombre: "Las Heras",     emoji: "⛰️", desc: "Al pie de los Andes" },
];

export default function SeccionDepartamentos() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-neutro-900">Buscá por zona</h2>
            <p className="text-neutro-500 mt-1">Explorá propiedades en cada departamento</p>
          </div>
          <Link href="/propiedades" className="text-sm text-marca-700 hover:underline font-medium hidden sm:block">
            Ver todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEPARTAMENTOS.map(dep => (
            <Link
              key={dep.nombre}
              href={`/propiedades?departamento=${encodeURIComponent(dep.nombre)}`}
              className="group tarjeta p-5 text-center hover:shadow-md hover:border-marca-300 hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-4xl block mb-2">{dep.emoji}</span>
              <p className="text-sm font-semibold text-neutro-800 group-hover:text-marca-700 transition-colors">
                {dep.nombre}
              </p>
              <p className="text-xs text-neutro-400 mt-0.5">{dep.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
