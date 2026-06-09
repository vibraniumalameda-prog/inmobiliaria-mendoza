"use client";

import { useState } from "react";

export default function FormularioConsulta({ propiedadId }: { propiedadId: string }) {
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    const form = e.currentTarget;
    const data = {
      propiedadId,
      nombreContacto: (form.elements.namedItem("nombre") as HTMLInputElement).value,
      emailContacto: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefonoContacto: (form.elements.namedItem("telefono") as HTMLInputElement).value,
      mensaje: (form.elements.namedItem("mensaje") as HTMLTextAreaElement).value,
    };

    await fetch("/api/consultas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setCargando(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="tarjeta p-4 text-center">
        <p className="font-semibold text-neutro-900">¡Consulta enviada!</p>
        <p className="text-sm text-neutro-500 mt-1">Te contactaremos a la brevedad.</p>
      </div>
    );
  }

  return (
    <div className="tarjeta p-4">
      <h3 className="font-semibold text-neutro-900 mb-3">Enviá tu consulta</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label">Nombre</label>
          <input name="nombre" required className="input" placeholder="Tu nombre" />
        </div>
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required className="input" placeholder="tu@email.com" />
        </div>
        <div>
          <label className="label">Teléfono (opcional)</label>
          <input name="telefono" className="input" placeholder="+54 261 000 0000" />
        </div>
        <div>
          <label className="label">Mensaje</label>
          <textarea
            name="mensaje"
            required
            rows={3}
            className="input resize-none"
            placeholder="Me interesa esta propiedad..."
          />
        </div>
        <button type="submit" disabled={cargando} className="btn-primario w-full disabled:opacity-60">
          {cargando ? "Enviando..." : "Enviar consulta"}
        </button>
      </form>
    </div>
  );
}
