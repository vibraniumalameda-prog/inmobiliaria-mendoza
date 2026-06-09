"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroBusqueda() {
  const router = useRouter();
  const [operacion, setOperacion] = useState("VENTA");
  const [tipo, setTipo] = useState("");
  const [departamento, setDepartamento] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ operacion });
    if (tipo) params.set("tipo", tipo);
    if (departamento) params.set("departamento", departamento);
    router.push(`/propiedades?${params.toString()}`);
  }

  return (
    <section
      className="relative bg-cover bg-center min-h-[520px] flex items-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')" }}
    >
      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutro-950/70 via-neutro-950/60 to-neutro-950/70" />

      <div className="relative w-full max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
          Encontrá tu propiedad en Mendoza
        </h1>
        <p className="text-neutro-200 text-lg mb-10">
          Casas, departamentos y terrenos en toda la provincia
        </p>

        {/* Tabs Venta / Alquiler / Temporario */}
        <div className="flex justify-center gap-2 mb-4">
          {[
            { val: "VENTA", label: "Venta" },
            { val: "ALQUILER", label: "Alquiler" },
            { val: "ALQUILER_TEMPORARIO", label: "Temporario" },
          ].map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setOperacion(val)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                operacion === val
                  ? "bg-marca-700 text-white"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Formulario */}
        <form
          onSubmit={buscar}
          className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row gap-3 items-end"
        >
          <div className="flex-1 text-left">
            <label className="label">Tipo de propiedad</label>
            <select className="input" value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Todos los tipos</option>
              <option value="CASA">Casa</option>
              <option value="DEPARTAMENTO">Departamento</option>
              <option value="TERRENO">Terreno</option>
              <option value="LOCAL_COMERCIAL">Local comercial</option>
              <option value="CAMPO">Campo / Finca</option>
            </select>
          </div>

          <div className="flex-1 text-left">
            <label className="label">Zona</label>
            <select className="input" value={departamento} onChange={e => setDepartamento(e.target.value)}>
              <option value="">Toda Mendoza</option>
              <option value="Capital">Capital</option>
              <option value="Godoy Cruz">Godoy Cruz</option>
              <option value="Guaymallén">Guaymallén</option>
              <option value="Luján de Cuyo">Luján de Cuyo</option>
              <option value="Maipú">Maipú</option>
              <option value="Las Heras">Las Heras</option>
            </select>
          </div>

          <button type="submit" className="btn-primario px-8 py-2.5 whitespace-nowrap w-full sm:w-auto">
            Buscar propiedades
          </button>
        </form>
      </div>
    </section>
  );
}
