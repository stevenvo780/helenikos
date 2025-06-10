import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helenikos - Aprendizaje del Griego Antiguo",
  description: "Plataforma universitaria para el aprendizaje y análisis del griego antiguo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
