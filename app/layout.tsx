import type { Metadata } from "next";
import "./globals.css";
import VlibrasWidget from "./components/VlibrasWidget";
import { defaultContent } from "../lib/cms-defaults";

const siteUrl = "https://claudiabenassuly.com.br";
const socialImage = `${siteUrl}/og.png`;

const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cláudia Benassuly — Deputada Federal 2323",
    template: "%s | Cláudia Benassuly",
  },
  description:
    "Site oficial de Cláudia Benassuly, candidata a Deputada Federal pelo Pará. Conheça sua trajetória, propostas, agenda e notícias da campanha.",
  applicationName: "Cláudia Benassuly",
  authors: [{ name: "Cláudia Benassuly" }],
  creator: "Cláudia Benassuly",
  publisher: "Cláudia Benassuly",
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
    siteName: "Cláudia Benassuly — Deputada Federal 2323",
    title: "Cláudia Benassuly — Deputada Federal 2323",
    description:
      "Conheça Cláudia Benassuly, sua trajetória, propostas, agenda e notícias da campanha no Pará.",
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: "Cláudia Benassuly — Deputada Federal 2323",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cláudia Benassuly — Deputada Federal 2323",
    description: "Por ela. Por nós. Por todas. Conheça Cláudia Benassuly e a campanha no Pará.",
    images: [socialImage],
  },
  icons: {
    // A square campaign mark renders reliably in browser tabs and on mobile
    // home screens; the full-width logo is not a valid favicon shape.
    icon: [{ url: "/favicon.png?v=2323", type: "image/png", sizes: "192x192" }],
    shortcut: "/favicon.png?v=2323",
    apple: "/favicon.png?v=2323",
  },
};

async function readCmsShareImage() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ubzgxmxroeygdukjsinh.supabase.co"}/functions/v1/cms-api?public=1`;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_seMfFGEGJrdg0qtQlF8lag_FkdixijL";
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { apikey: key, authorization: `Bearer ${key}` },
    });
    if (!response.ok) return socialImage;
    const payload = await response.json() as { content?: Record<string, string> };
    const configured = String(payload.content?.ogImage ?? defaultContent.ogImage ?? "").trim();
    if (configured.startsWith("data:") || configured.startsWith("blob:")) return socialImage;
    if (/^https?:\/\//i.test(configured)) return configured;
    if (configured.startsWith("/")) return new URL(configured, siteUrl).toString();
  } catch {
    // Metadata must remain renderable when Supabase is temporarily unavailable.
  }
  return socialImage;
}

export async function generateMetadata(): Promise<Metadata> {
  const shareImage = await readCmsShareImage();
  return {
    ...baseMetadata,
    openGraph: {
      ...(baseMetadata.openGraph ?? {}),
      images: [{ url: shareImage, width: 1200, height: 630, alt: "Cláudia Benassuly — Deputada Federal 2323" }],
    },
    twitter: { ...(baseMetadata.twitter ?? {}), images: [shareImage] },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Cláudia Benassuly — Deputada Federal 2323",
      description: "Site oficial de Cláudia Benassuly, candidata a Deputada Federal pelo Pará.",
      inLanguage: "pt-BR",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#claudia-benassuly`,
      name: "Cláudia Benassuly",
      url: siteUrl,
      image: socialImage,
      jobTitle: "Candidata a Deputada Federal",
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
        <meta name="codex-preview" content="development" />
        <link rel="preconnect" href="https://vlibras.gov.br" />
        <link rel="dns-prefetch" href="https://vlibras.gov.br" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}<VlibrasWidget /></body>
    </html>
  );
}
