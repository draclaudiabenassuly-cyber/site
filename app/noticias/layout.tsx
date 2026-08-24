import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias da campanha",
  description: "Notícias, posicionamentos e atualizações da campanha de Cláudia Benassuly no Pará.",
  alternates: { canonical: "/noticias" },
  openGraph: {
    title: "Notícias da campanha | Cláudia Benassuly",
    description: "Acompanhe notícias e atualizações da campanha de Cláudia Benassuly.",
    url: "/noticias",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Notícias da campanha de Cláudia Benassuly" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function NoticiasLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
