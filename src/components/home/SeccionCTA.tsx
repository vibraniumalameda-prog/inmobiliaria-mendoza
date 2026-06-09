import Link from "next/link";

export default function SeccionCTA() {
  return (
    <section className="bg-marca-700 py-14">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          ¿Querés vender o alquilar tu propiedad?
        </h2>
        <p className="text-marca-200 text-lg mb-8">
          Contamos con los mejores agentes de Mendoza. Te ayudamos en todo el proceso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://wa.me/5492617670001"
            target="_blank"
            className="bg-white text-marca-700 font-semibold px-8 py-3 rounded-xl hover:bg-marca-50 transition-colors"
          >
            Contactar por WhatsApp
          </Link>
          <Link
            href="/propiedades"
            className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
          >
            Ver propiedades
          </Link>
        </div>
      </div>
    </section>
  );
}
