import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  urlThumb: z.string().url(),
  altText: z.string().optional(),
  esPrincipal: z.boolean().default(false),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const data = schema.parse(body);

  // Si es principal, quitar el flag de las otras
  if (data.esPrincipal) {
    await prisma.imagenPropiedad.updateMany({
      where: { propiedadId: params.id },
      data: { esPrincipal: false },
    });
  }

  // Orden = última posición
  const maxOrden = await prisma.imagenPropiedad.aggregate({
    where: { propiedadId: params.id },
    _max: { orden: true },
  });

  const imagen = await prisma.imagenPropiedad.create({
    data: {
      propiedadId: params.id,
      url: data.url,
      urlThumb: data.urlThumb,
      altText: data.altText,
      esPrincipal: data.esPrincipal,
      orden: (maxOrden._max.orden ?? -1) + 1,
    },
  });

  return NextResponse.json(imagen);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { imagenId } = await req.json();
  await prisma.imagenPropiedad.delete({ where: { id: imagenId } });
  return NextResponse.json({ ok: true });
}
