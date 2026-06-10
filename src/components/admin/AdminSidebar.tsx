"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Home, Plus, List, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/propiedades", label: "Propiedades", icon: List },
  { href: "/admin/propiedades/nueva", label: "Nueva propiedad", icon: Plus },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-neutro-950 text-neutro-300 flex flex-col min-h-screen">
      <div className="p-5 border-b border-neutro-800">
        <p className="font-bold text-white text-sm">Mangione Propiedades</p>
        <p className="text-xs text-neutro-500 mt-0.5">Panel de gestión</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-marca-700 text-white"
                : "hover:bg-neutro-800 hover:text-white"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-neutro-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-neutro-800 hover:text-white transition-colors"
        >
          <Home size={16} />
          Ver sitio
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-neutro-800 hover:text-white transition-colors mt-1"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
