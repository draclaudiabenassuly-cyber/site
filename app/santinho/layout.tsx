import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Santinho virtual e material da campanha",
  description: "Acesse o santinho virtual de Cláudia Benassuly e prepare a arte para impressão ou PDF.",
  alternates: { canonical: "/santinho" },
  openGraph: {
    title: "Santinho virtual | Cláudia Benassuly 2323",
    description: "Acesse e compartilhe o material oficial da campanha de Cláudia Benassuly.",
    url: "/santinho",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Santinho virtual de Cláudia Benassuly 2323" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function SantinhoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
