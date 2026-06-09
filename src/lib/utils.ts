import { type ClassValue, clsx } from "clsx";
import { Decimal } from "@prisma/client/runtime/library";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatearPrecio(precio: Decimal | number, moneda: string): string {
  const num = Number(precio);
  const simbolo = moneda === "USD" ? "USD" : "$";
  return `${simbolo} ${num.toLocaleString("es-AR")}`;
}

export function formatearSuperficie(m2: Decimal | number | null | undefined): string {
  if (m2 == null) return "-";
  return `${Number(m2).toLocaleString("es-AR")} m²`;
}
