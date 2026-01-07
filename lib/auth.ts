import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        role: { label: "Role", type: "text" },
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        portalCode: { label: "Portal Code", type: "text" },
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.role) return null;
        if (credentials.role === "ADMIN") {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          if (!adminEmail || !adminPassword) return null;
          if (credentials.email !== adminEmail || credentials.password !== adminPassword) {
            return null;
          }
          const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: { role: "ADMIN" },
            create: {
              email: adminEmail,
              role: "ADMIN",
              passwordHash: "env",
            },
          });
          return { id: admin.id, email: admin.email, role: admin.role } as any;
        }

        const portalCode = credentials.portalCode?.trim();
        const phone = credentials.phone?.trim();
        if (!portalCode || !phone) return null;

        const profile = await prisma.studentProfile.findUnique({
          where: { portalCode },
          include: { user: true },
        });
        if (!profile?.user || profile.user.phone !== phone) return null;

        return { id: profile.user.id, email: profile.user.email, role: profile.user.role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
