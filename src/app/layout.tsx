import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: {
    default: "Inmobiliaria Mendoza | Propiedades en Venta y Alquiler",
    template: "%s | Inmobiliaria Mendoza",
  },
  description:
    "Encontrá tu propiedad ideal en Mendoza. Casas, departamentos y terrenos en venta y alquiler en Godoy Cruz, Luján de Cuyo, Guaymallén y toda la provincia.",
  keywords: ["inmobiliaria mendoza", "propiedades mendoza", "casas en venta mendoza", "alquiler mendoza"],
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
