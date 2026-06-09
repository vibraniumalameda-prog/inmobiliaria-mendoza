import { Suspense } from "react";
import HeroBusqueda from "@/components/home/HeroBusqueda";
import PropiedadesDestacadas from "@/components/home/PropiedadesDestacadas";
import SeccionDepartamentos from "@/components/home/SeccionDepartamentos";
import SeccionCTA from "@/components/home/SeccionCTA";

export default function HomePage() {
  return (
    <>
      <HeroBusqueda />
      <Suspense fallback={<div className="h-64" />}>
        <PropiedadesDestacadas />
      </Suspense>
      <SeccionDepartamentos />
      <SeccionCTA />
    </>
  );
}
