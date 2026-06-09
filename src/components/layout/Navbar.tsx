"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="bg-white border-b border-neutro-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-marca-700">
          Inmobiliaria Mendoza
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutro-700">
          <Link href="/propiedades?operacion=VENTA" className="hover:text-marca-700 transition-colors">
            Venta
          </Link>
          <Link href="/propiedades?operacion=ALQUILER" className="hover:text-marca-700 transition-colors">
            Alquiler
          </Link>
          <Link href="/propiedades?operacion=ALQUILER_TEMPORARIO" className="hover:text-marca-700 transition-colors">
            Temporario
          </Link>
          <Link href="/propiedades" className="btn-primario text-sm">
            Buscar
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-neutro-700"
          onClick={() => setAbierto(!abierto)}
          aria-label="Menú"
        >
          {abierto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {abierto && (
        <div className="md:hidden border-t border-neutro-200 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/propiedades?operacion=VENTA" onClick={() => setAbierto(false)}>Venta</Link>
          <Link href="/propiedades?operacion=ALQUILER" onClick={() => setAbierto(false)}>Alquiler</Link>
          <Link href="/propiedades?operacion=ALQUILER_TEMPORARIO" onClick={() => setAbierto(false)}>Temporario</Link>
          <Link href="/propiedades" className="btn-primario text-center" onClick={() => setAbierto(false)}>
            Buscar
          </Link>
        </div>
      )}
    </header>
  );
}
