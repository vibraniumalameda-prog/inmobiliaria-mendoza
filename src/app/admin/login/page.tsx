"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const form = e.currentTarget;
    const res = await signIn("credentials", {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      redirect: false,
    });

    setCargando(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-neutro-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-neutro-900 mb-1">Panel Admin</h1>
        <p className="text-sm text-neutro-500 mb-6">Inmobiliaria Mendoza</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" placeholder="admin@inmobiliaria.com" />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input name="password" type="password" required className="input" placeholder="••••••••" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={cargando} className="btn-primario w-full disabled:opacity-60">
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
