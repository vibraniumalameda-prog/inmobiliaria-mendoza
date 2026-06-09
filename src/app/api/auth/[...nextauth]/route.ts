import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario || !usuario.activo) return null;

        const passwordOk = await bcrypt.compare(credentials.password, usuario.passwordHash);
        if (!passwordOk) return null;

        return {
          id: usuario.id,
          name: `${usuario.nombre} ${usuario.apellido}`,
          email: usuario.email,
          role: usuario.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as unknown as { role: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as unknown as { role: string }).role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
