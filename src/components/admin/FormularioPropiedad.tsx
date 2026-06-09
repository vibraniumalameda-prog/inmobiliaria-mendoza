"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Barrio, Departamento, Amenity } from "@prisma/client";

interface Props {
  departamentos: (Departamento & { barrios: Barrio[] })[];
  amenities: Amenity[];
  propiedadId?: string;
  valores?: Record<string, unknown>;
}

export default function FormularioPropiedad({ departamentos, amenities, propiedadId, valores }: Props) {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [deptoSeleccionado, setDeptoSeleccionado] = useState<number | null>(null);

  const barriosDisponibles = deptoSeleccionado
    ? departamentos.find(d => d.id === deptoSeleccionado)?.barrios ?? []
    : [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value;

    const amenitiesSeleccionados = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="amenities"]:checked')
    ).map(el => Number(el.value));

    const body = {
      titulo: getValue("titulo"),
      descripcion: getValue("descripcion"),
      tipoOperacion: getValue("tipoOperacion"),
      tipoPropiedad: getValue("tipoPropiedad"),
      estadoConstruccion: getValue("estadoConstruccion"),
      precio: Number(getValue("precio")),
      moneda: getValue("moneda"),
      precioNegociable: (form.elements.namedItem("precioNegociable") as HTMLInputElement)?.checked,
      superficieTotal: getValue("superficieTotal") ? Number(getValue("superficieTotal")) : null,
      superficieCubierta: getValue("superficieCubierta") ? Number(getValue("superficieCubierta")) : null,
      dormitorios: getValue("dormitorios") ? Number(getValue("dormitorios")) : null,
      banos: getValue("banos") ? Number(getValue("banos")) : null,
      cocheras: getValue("cocheras") ? Number(getValue("cocheras")) : 0,
      antiguedad: getValue("antiguedad") ? Number(getValue("antiguedad")) : null,
      direccion: getValue("direccion"),
      barrioId: getValue("barrioId") ? Number(getValue("barrioId")) : null,
      latitud: getValue("latitud") ? Number(getValue("latitud")) : null,
      longitud: getValue("longitud") ? Number(getValue("longitud")) : null,
      mostrarDireccionExacta: (form.elements.namedItem("mostrarDireccionExacta") as HTMLInputElement)?.checked,
      destacada: (form.elements.namedItem("destacada") as HTMLInputElement)?.checked,
      amenities: amenitiesSeleccionados,
    };

    const url = propiedadId ? `/api/admin/propiedades/${propiedadId}` : "/api/admin/propiedades";
    const method = propiedadId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setCargando(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
      return;
    }

    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Sección: Clasificación */}
      <Seccion titulo="Clasificación">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Campo label="Operación">
            <select name="tipoOperacion" className="input" required defaultValue={String(valores?.tipoOperacion ?? "")}>
              <option value="">Seleccioná</option>
              <option value="VENTA">Venta</option>
              <option value="ALQUILER">Alquiler</option>
              <option value="ALQUILER_TEMPORARIO">Alquiler temporario</option>
            </select>
          </Campo>
          <Campo label="Tipo de propiedad">
            <select name="tipoPropiedad" className="input" required defaultValue={String(valores?.tipoPropiedad ?? "")}>
              <option value="">Seleccioná</option>
              <option value="CASA">Casa</option>
              <option value="DEPARTAMENTO">Departamento</option>
              <option value="TERRENO">Terreno</option>
              <option value="LOCAL_COMERCIAL">Local comercial</option>
              <option value="OFICINA">Oficina</option>
              <option value="GALPON">Galpón</option>
              <option value="CAMPO">Campo / Finca</option>
              <option value="COCHERA">Cochera</option>
            </select>
          </Campo>
          <Campo label="Estado de construcción">
            <select name="estadoConstruccion" className="input" defaultValue={String(valores?.estadoConstruccion ?? "USADO")}>
              <option value="USADO">Usado</option>
              <option value="A_ESTRENAR">A estrenar</option>
              <option value="EN_CONSTRUCCION">En construcción</option>
              <option value="EN_POZO">En pozo</option>
            </select>
          </Campo>
        </div>
      </Seccion>

      {/* Sección: Descripción */}
      <Seccion titulo="Descripción">
        <Campo label="Título del aviso">
          <input name="titulo" required className="input" placeholder="Casa 3 dorm con pileta en Chacras de Coria"
            defaultValue={String(valores?.titulo ?? "")} />
        </Campo>
        <Campo label="Descripción completa">
          <textarea name="descripcion" required rows={5} className="input resize-none"
            placeholder="Descripción detallada de la propiedad..."
            defaultValue={String(valores?.descripcion ?? "")} />
        </Campo>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="destacada" defaultChecked={Boolean(valores?.destacada)} className="rounded" />
            Propiedad destacada
          </label>
        </div>
      </Seccion>

      {/* Sección: Precio */}
      <Seccion titulo="Precio">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Campo label="Precio">
            <input name="precio" type="number" required className="input" placeholder="150000"
              defaultValue={String(valores?.precio ?? "")} />
          </Campo>
          <Campo label="Moneda">
            <select name="moneda" className="input" defaultValue={String(valores?.moneda ?? "USD")}>
              <option value="USD">USD (Dólares)</option>
              <option value="ARS">ARS (Pesos)</option>
            </select>
          </Campo>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="precioNegociable" defaultChecked={Boolean(valores?.precioNegociable)} />
              Precio negociable
            </label>
          </div>
        </div>
      </Seccion>

      {/* Sección: Características */}
      <Seccion titulo="Características">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Campo label="Superficie total (m²)">
            <input name="superficieTotal" type="number" className="input" placeholder="200"
              defaultValue={String(valores?.superficieTotal ?? "")} />
          </Campo>
          <Campo label="Superficie cubierta (m²)">
            <input name="superficieCubierta" type="number" className="input" placeholder="150"
              defaultValue={String(valores?.superficieCubierta ?? "")} />
          </Campo>
          <Campo label="Dormitorios">
            <input name="dormitorios" type="number" min="0" className="input" placeholder="3"
              defaultValue={String(valores?.dormitorios ?? "")} />
          </Campo>
          <Campo label="Baños">
            <input name="banos" type="number" min="0" className="input" placeholder="2"
              defaultValue={String(valores?.banos ?? "")} />
          </Campo>
          <Campo label="Cocheras">
            <input name="cocheras" type="number" min="0" className="input" placeholder="1"
              defaultValue={String(valores?.cocheras ?? "0")} />
          </Campo>
          <Campo label="Antigüedad (años)">
            <input name="antiguedad" type="number" min="0" className="input" placeholder="10"
              defaultValue={String(valores?.antiguedad ?? "")} />
          </Campo>
        </div>
      </Seccion>

      {/* Sección: Ubicación */}
      <Seccion titulo="Ubicación">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Departamento">
            <select className="input" onChange={e => setDeptoSeleccionado(Number(e.target.value))}>
              <option value="">Seleccioná departamento</option>
              {departamentos.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Barrio">
            <select name="barrioId" className="input" defaultValue={String(valores?.barrioId ?? "")}>
              <option value="">Seleccioná barrio</option>
              {barriosDisponibles.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
          </Campo>
        </div>
        <Campo label="Dirección (sin número exacto si preferís privacidad)">
          <input name="direccion" required className="input" placeholder="Ej: Calle Las Heras al 1200"
            defaultValue={String(valores?.direccion ?? "")} />
        </Campo>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Latitud (para el mapa)">
            <input name="latitud" type="number" step="any" className="input" placeholder="-32.890"
              defaultValue={String(valores?.latitud ?? "")} />
          </Campo>
          <Campo label="Longitud">
            <input name="longitud" type="number" step="any" className="input" placeholder="-68.845"
              defaultValue={String(valores?.longitud ?? "")} />
          </Campo>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" name="mostrarDireccionExacta" defaultChecked={Boolean(valores?.mostrarDireccionExacta)} />
          Mostrar dirección exacta en el mapa
        </label>
      </Seccion>

      {/* Sección: Amenities */}
      <Seccion titulo="Amenities">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {amenities.map(a => (
            <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="amenities" value={a.id} className="rounded" />
              {a.nombre}
            </label>
          ))}
        </div>
      </Seccion>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={cargando} className="btn-primario disabled:opacity-60">
          {cargando ? "Guardando..." : propiedadId ? "Guardar cambios" : "Publicar propiedad"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secundario">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-neutro-200 p-5">
      <h2 className="font-semibold text-neutro-900 mb-4 pb-3 border-b border-neutro-100">{titulo}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
