import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  propiedadId: z.string(),
  nombreContacto: z.string().min(2),
  emailContacto: z.string().email(),
  telefonoContacto: z.string().optional(),
  mensaje: z.string().min(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Verificar que la propiedad existe
    const propiedad = await prisma.propiedad.findUnique({
      where: { id: data.propiedadId },
      select: { agenteId: true },
    });
    if (!propiedad) return NextResponse.json({ error: "Propiedad no encontrada" }, { status: 404 });

    await prisma.consulta.create({
      data: {
        ...data,
        agenteId: propiedad.agenteId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
