import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// Client-ID público de Imgur (para uso anónimo)
const IMGUR_CLIENT_ID = "546c25a59c58ad7";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Sin archivo" }, { status: 400 });

  // Convertir a base64
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Subir a Imgur
  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64, type: "base64" }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Error al subir imagen a Imgur" }, { status: 500 });
  }

  const data = await res.json();
  const url: string = data.data.link;

  // Imgur no tiene thumbnails automáticos, usamos la misma URL
  // pero podemos agregar sufijo "m" para medium (320x320)
  const urlThumb = url.replace(/(\.\w+)$/, "m$1");

  return NextResponse.json({ url, urlThumb });
}
