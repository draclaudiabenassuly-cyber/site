import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Santinho virtual e material da campanha",
  description: "Acesse o santinho virtual de Claudia Benassuly e prepare a arte para impressão ou PDF.",
  alternates: { canonical: "/santinho" },
  openGraph: {
    title: "Santinho virtual | Claudia Benassuly 2323",
    description: "Acesse e compartilhe o material oficial da campanha de Claudia Benassuly.",
    url: "/santinho",
    type: "website",
  },
};

export default function SantinhoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
