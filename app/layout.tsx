import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://claudiabenassuly.com.br";
const socialImage = `${siteUrl}/campaign/logo-slogan-color.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Claudia Benassuly — Deputada Federal 2323",
  description: "Site oficial da pré-campanha de Claudia Benassuly. Por ela. Por nós. Por todas.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Claudia Benassuly — Deputada Federal 2323",
    title: "Claudia Benassuly — Deputada Federal 2323",
    description: "Por ela. Por nós. Por todas. Conheça a campanha de Claudia Benassuly.",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Claudia Benassuly — Deputada Federal 2323",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claudia Benassuly — Deputada Federal 2323",
    description: "Por ela. Por nós. Por todas.",
    images: [socialImage],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
