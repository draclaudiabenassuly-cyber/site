import type { MetadataRoute } from "next";

const baseUrl = "https://claudiabenassuly.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/agenda`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/noticias`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/santinho`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/termos-de-uso`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
