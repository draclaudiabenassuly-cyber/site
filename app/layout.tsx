import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claudia Benassuly — Deputada Federal 2323",
  description: "Site oficial da pré-campanha de Claudia Benassuly. Por ela. Por nós. Por todas.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
