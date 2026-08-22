import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias da campanha",
  description: "Notícias, posicionamentos e atualizações da campanha de Claudia Benassuly no Pará.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Notícias da campanha | Claudia Benassuly",
    description: "Acompanhe notícias e atualizações da campanha de Claudia Benassuly.",
    url: "/noticias",
    type: "website",
  },
};

export default function NoticiasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
