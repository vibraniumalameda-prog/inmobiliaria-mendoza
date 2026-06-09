import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(5),
  descripcion: z.string().min(10),
  tipoOperacion: z.enum(["VENTA", "ALQUILER", "ALQUILER_TEMPORARIO"]),
  tipoPropiedad: z.enum(["CASA", "DEPARTAMENTO", "TERRENO", "LOCAL_COMERCIAL", "OFICINA", "GALPON", "CAMPO", "COCHERA"]),
  estadoConstruccion: z.enum(["EN_POZO", "EN_CONSTRUCCION", "A_ESTRENAR", "USADO"]).default("USADO"),
  estado: z.enum(["DISPONIBLE", "RESERVADA", "VENDIDA", "ALQUILADA", "PAUSADA"]).optional(),
  precio: z.number().positive(),
  moneda: z.enum(["USD", "ARS"]).default("USD"),
  precioNegociable: z.boolean().default(false),
  superficieTotal: z.number().nullable().optional(),
  superficieCubierta: z.number().nullable().optional(),
  dormitorios: z.number().nullable().optional(),
  banos: z.number().nullable().optional(),
  cocheras: z.number().default(0),
  antiguedad: z.number().nullable().optional(),
  direccion: z.string().min(3),
  barrioId: z.number().nullable().optional(),
  latitud: z.number().nullable().optional(),
  longitud: z.number().nullable().optional(),
  mostrarDireccionExacta: z.boolean().default(false),
  destacada: z.boolean().default(false),
  amenities: z.array(z.number()).default([]),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const { amenities, ...data } = schema.parse(body);

    // Reemplazar amenities
    await prisma.amenityPropiedad.deleteMany({ where: { propiedadId: params.id } });

    const propiedad = await prisma.propiedad.update({
      where: { id: params.id },
      data: {
        ...data,
        amenities: { create: amenities.map(id => ({ amenityId: id })) },
      },
    });

    return NextResponse.json({ ok: true, slug: propiedad.slug });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await prisma.propiedad.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
