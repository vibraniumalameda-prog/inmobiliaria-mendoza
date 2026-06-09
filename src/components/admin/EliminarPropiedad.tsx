"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function EliminarPropiedad({ propiedadId }: { propiedadId: string }) {
  const [confirm, setConfirm] = useState(false);
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function eliminar() {
    setCargando(true);
    await fetch(`/api/admin/propiedades/${propiedadId}`, { method: "DELETE" });
    router.push("/admin/propiedades");
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">¿Confirmar eliminación?</span>
        <button onClick={eliminar} disabled={cargando}
          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-60">
          {cargando ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button onClick={() => setConfirm(false)} className="btn-secundario text-sm py-1.5">
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirm(true)}
      className="flex items-center gap-2 text-red-600 hover:bg-red-50 border border-red-200 px-3 py-2 rounded-lg text-sm transition-colors">
      <Trash2 size={15} /> Eliminar
    </button>
  );
}
