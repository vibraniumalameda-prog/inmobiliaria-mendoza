import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Mangione Propiedades | Propiedades en Venta y Alquiler en Mendoza",
    template: "%s | Mangione Propiedades",
  },
  description:
    "Encontrá tu propiedad ideal en Mendoza con Mangione Propiedades. Casas, departamentos y terrenos en venta y alquiler en Godoy Cruz, Luján de Cuyo, Guaymallén y toda la provincia.",
  keywords: ["mangione propiedades", "inmobiliaria mendoza", "propiedades mendoza", "casas en venta mendoza", "alquiler mendoza"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
