import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutro-950 text-neutro-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-white text-lg mb-2">Inmobiliaria Mendoza</p>
          <p className="text-sm">Especialistas en propiedades en toda la provincia de Mendoza.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Búsquedas frecuentes</p>
          <ul className="space-y-1 text-sm">
            <li><Link href="/propiedades?operacion=VENTA&tipo=CASA" className="hover:text-white">Casas en venta</Link></li>
            <li><Link href="/propiedades?operacion=ALQUILER&tipo=DEPARTAMENTO" className="hover:text-white">Departamentos en alquiler</Link></li>
            <li><Link href="/propiedades?operacion=VENTA&tipo=TERRENO" className="hover:text-white">Terrenos en venta</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Contacto</p>
          <p className="text-sm">Mendoza, Argentina</p>
          <p className="text-sm mt-1">info@inmobiliaria.com</p>
        </div>
      </div>
      <p className="text-center text-xs text-neutro-600 mt-8">
        © {new Date().getFullYear()} Inmobiliaria Mendoza. Todos los derechos reservados.
      </p>
    </footer>
  );
}
