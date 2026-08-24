import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda da campanha",
  description: "Confira a agenda pública de Cláudia Benassuly, com encontros, escutas e compromissos no Pará.",
  alternates: { canonical: "/agenda" },
  openGraph: {
    title: "Agenda da campanha | Cláudia Benassuly",
    description: "Confira os próximos encontros, escutas e compromissos de Cláudia Benassuly no Pará.",
    url: "/agenda",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Agenda da campanha de Cláudia Benassuly" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function AgendaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
