# Setup — Inmobiliaria Mendoza

## 1. Instalar Node.js
Bajá la versión LTS desde https://nodejs.org y reiniciá la terminal.

## 2. Instalar PostgreSQL
Bajá desde https://www.postgresql.org/download/windows/
Durante la instalación anotá el usuario (postgres) y la contraseña.

## 3. Crear la base de datos
```sql
CREATE DATABASE inmobiliaria_mza;
```

## 4. Configurar variables de entorno
Copiá `.env.example` a `.env.local` y completá:
```
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/inmobiliaria_mza"
NEXTAUTH_SECRET="cualquier-string-largo-aleatorio"
NEXTAUTH_URL="http://localhost:3000"
```

## 5. Instalar dependencias
```bash
npm install
```

## 6. Crear tablas y cargar datos iniciales
```bash
npm run db:push     # crea las tablas
npm run db:seed     # carga departamentos, barrios, amenities y admin
```

## 7. Correr en desarrollo
```bash
npm run dev
```
Abrí http://localhost:3000

## 8. Ver la base de datos visualmente
```bash
npm run db:studio
```

---

## Credenciales admin por defecto
- Email: admin@inmobiliaria.com
- Password: admin123
(Cambiala en producción)
