import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import slugify from "slugify";
import { z } from "zod";

const schema = z.object({
  titulo: z.string().min(5),
  descripcion: z.string().min(10),
  tipoOperacion: z.enum(["VENTA", "ALQUILER", "ALQUILER_TEMPORARIO"]),
  tipoPropiedad: z.enum(["CASA", "DEPARTAMENTO", "TERRENO", "LOCAL_COMERCIAL", "OFICINA", "GALPON", "CAMPO", "COCHERA"]),
  estadoConstruccion: z.enum(["EN_POZO", "EN_CONSTRUCCION", "A_ESTRENAR", "USADO"]).default("USADO"),
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

function generarCodigo() {
  return `MZA-${String(Date.now()).slice(-5)}`;
}

function generarSlugUnico(titulo: string) {
  const base = slugify(titulo, { lower: true, strict: true, locale: "es" });
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Obtener el agente por email de sesión
    const agente = await prisma.usuario.findUnique({ where: { email: session.user!.email! } });
    if (!agente) return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });

    const { amenities, ...propiedadData } = data;

    const propiedad = await prisma.propiedad.create({
      data: {
        ...propiedadData,
        codigo: generarCodigo(),
        slug: generarSlugUnico(data.titulo),
        agenteId: agente.id,
        publicadaEn: new Date(),
        amenities: {
          create: amenities.map(id => ({ amenityId: id })),
        },
      },
    });

    return NextResponse.json({ ok: true, id: propiedad.id, slug: propiedad.slug });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 });
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
