"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function FiltrosBusqueda({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const router = useRouter();
  const current = useSearchParams();

  const actualizar = useCallback((clave: string, valor: string) => {
    const params = new URLSearchParams(current.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    params.delete("pagina");
    router.push(`/propiedades?${params.toString()}`);
  }, [current, router]);

  const limpiar = () => router.push("/propiedades");

  return (
    <div className="tarjeta p-4 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-neutro-900">Filtros</h2>
        <button onClick={limpiar} className="text-xs text-marca-700 hover:underline">
          Limpiar
        </button>
      </div>

      <div>
        <label className="label">Operación</label>
        <select className="input" defaultValue={searchParams.operacion ?? ""} onChange={e => actualizar("operacion", e.target.value)}>
          <option value="">Todas</option>
          <option value="VENTA">Venta</option>
          <option value="ALQUILER">Alquiler</option>
          <option value="ALQUILER_TEMPORARIO">Temporario</option>
        </select>
      </div>

      <div>
        <label className="label">Tipo de propiedad</label>
        <select className="input" defaultValue={searchParams.tipo ?? ""} onChange={e => actualizar("tipo", e.target.value)}>
          <option value="">Todos</option>
          <option value="CASA">Casa</option>
          <option value="DEPARTAMENTO">Departamento</option>
          <option value="TERRENO">Terreno</option>
          <option value="LOCAL_COMERCIAL">Local comercial</option>
          <option value="GALPON">Galpón</option>
          <option value="CAMPO">Campo / Finca</option>
          <option value="COCHERA">Cochera</option>
        </select>
      </div>

      <div>
        <label className="label">Departamento</label>
        <select className="input" defaultValue={searchParams.departamento ?? ""} onChange={e => actualizar("departamento", e.target.value)}>
          <option value="">Toda Mendoza</option>
          <option value="Capital">Capital</option>
          <option value="Godoy Cruz">Godoy Cruz</option>
          <option value="Guaymallén">Guaymallén</option>
          <option value="Luján de Cuyo">Luján de Cuyo</option>
          <option value="Maipú">Maipú</option>
          <option value="Las Heras">Las Heras</option>
          <option value="Rivadavia">Rivadavia</option>
          <option value="San Martín">San Martín</option>
        </select>
      </div>

      <div>
        <label className="label">Dormitorios mínimos</label>
        <select className="input" defaultValue={searchParams.dormitorios ?? ""} onChange={e => actualizar("dormitorios", e.target.value)}>
          <option value="">Cualquiera</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div>
        <label className="label">Precio mínimo (USD)</label>
        <input
          type="number"
          className="input"
          placeholder="Ej: 50000"
          defaultValue={searchParams.precioMin ?? ""}
          onBlur={e => actualizar("precioMin", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Precio máximo (USD)</label>
        <input
          type="number"
          className="input"
          placeholder="Ej: 200000"
          defaultValue={searchParams.precioMax ?? ""}
          onBlur={e => actualizar("precioMax", e.target.value)}
        />
      </div>
    </div>
  );
}
