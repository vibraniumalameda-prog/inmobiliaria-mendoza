import { PrismaClient, RolUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Departamentos y barrios de Mendoza
  const departamentos = [
    {
      nombre: "Capital",
      barrios: ["Centro", "Quinta Sección", "Sexta Sección", "Residencial"],
    },
    {
      nombre: "Godoy Cruz",
      barrios: ["Bombal", "Las Tortugas", "Presidente Alvear", "San Vicente"],
    },
    {
      nombre: "Guaymallén",
      barrios: ["Dorrego", "El Sauce", "General Belgrano", "Buena Nueva"],
    },
    {
      nombre: "Luján de Cuyo",
      barrios: ["Chacras de Coria", "Vistalba", "Mayor Drummond", "El Carrizal"],
    },
    {
      nombre: "Maipú",
      barrios: ["Ciudad de Maipú", "Luzuriaga", "Russell", "Rodeo del Medio"],
    },
    {
      nombre: "Las Heras",
      barrios: ["El Challao", "Panquehua", "Capilla del Rosario", "El Plumerillo"],
    },
    {
      nombre: "Rivadavia",
      barrios: ["Ciudad Rivadavia", "La Central", "El Mirador"],
    },
    {
      nombre: "San Martín",
      barrios: ["Ciudad de San Martín", "Palmira", "Alto Salvador"],
    },
  ];

  for (const dep of departamentos) {
    const depto = await prisma.departamento.upsert({
      where: { nombre: dep.nombre },
      update: {},
      create: { nombre: dep.nombre },
    });

    for (const barrio of dep.barrios) {
      await prisma.barrio.upsert({
        where: { nombre_departamentoId: { nombre: barrio, departamentoId: depto.id } },
        update: {},
        create: { nombre: barrio, departamentoId: depto.id },
      });
    }
  }

  // Amenities base
  const amenities = [
    { nombre: "Pileta", icono: "waves" },
    { nombre: "Parrilla", icono: "flame" },
    { nombre: "Gimnasio", icono: "dumbbell" },
    { nombre: "Jardín", icono: "trees" },
    { nombre: "Seguridad 24hs", icono: "shield" },
    { nombre: "Salón de Usos Múltiples", icono: "building-2" },
    { nombre: "Terraza", icono: "sun" },
    { nombre: "Bodega/Wine Cellar", icono: "wine" },
    { nombre: "Calefacción Central", icono: "thermometer" },
    { nombre: "Aire Acondicionado", icono: "wind" },
    { nombre: "Vista a la Cordillera", icono: "mountain" },
    { nombre: "Laundry", icono: "shirt" },
  ];

  for (const a of amenities) {
    await prisma.amenity.upsert({
      where: { nombre: a.nombre },
      update: {},
      create: a,
    });
  }

  // Usuario admin por defecto
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.usuario.upsert({
    where: { email: "admin@inmobiliaria.com" },
    update: {},
    create: {
      nombre: "Admin",
      apellido: "Sistema",
      email: "admin@inmobiliaria.com",
      passwordHash,
      rol: RolUsuario.ADMIN,
    },
  });

  console.log("Seed completado: departamentos, barrios, amenities y usuario admin cargados.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
