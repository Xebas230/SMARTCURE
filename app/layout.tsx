import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCure — Demo",
  description: "Beneficio correcto en el momento de necesidad",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-slate-100 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
