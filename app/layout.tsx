import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://claudiabenassuly.com.br";
const socialImage = `${siteUrl}/campaign/logo-slogan-color.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Claudia Benassuly — Deputada Federal 2323",
    template: "%s | Claudia Benassuly",
  },
  description:
    "Site oficial de Claudia Benassuly, pré-candidata a Deputada Federal pelo Pará. Conheça sua trajetória, propostas, agenda e notícias da campanha.",
  applicationName: "Claudia Benassuly",
  authors: [{ name: "Claudia Benassuly" }],
  creator: "Claudia Benassuly",
  publisher: "Claudia Benassuly",
  category: "politics",
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Claudia Benassuly — Deputada Federal 2323",
    title: "Claudia Benassuly — Deputada Federal 2323",
    description:
      "Conheça Claudia Benassuly, sua trajetória, propostas, agenda e notícias da campanha no Pará.",
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
    description: "Por ela. Por nós. Por todas. Conheça Claudia Benassuly e a campanha no Pará.",
    images: [socialImage],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Claudia Benassuly — Deputada Federal 2323",
      description: "Site oficial de Claudia Benassuly, pré-candidata a Deputada Federal pelo Pará.",
      inLanguage: "pt-BR",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#claudia-benassuly`,
      name: "Claudia Benassuly",
      url: siteUrl,
      image: socialImage,
      jobTitle: "Pré-candidata a Deputada Federal",
      homeLocation: { "@type": "Place", name: "Pará, Brasil" },
      sameAs: [
        "https://www.instagram.com/claudiabenassuly/",
        "https://www.tiktok.com/@claudiabenassuly",
      ],
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
