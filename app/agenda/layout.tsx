import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda da campanha",
  description: "Confira a agenda pública de Claudia Benassuly, com encontros, escutas e compromissos no Pará.",
  alternates: { canonical: "/agenda" },
  openGraph: {
    title: "Agenda da campanha | Claudia Benassuly",
    description: "Confira os próximos encontros, escutas e compromissos de Claudia Benassuly no Pará.",
    url: "/agenda",
    type: "website",
  },
};

export default function AgendaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
