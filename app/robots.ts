import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://claudiabenassuly.com.br/sitemap.xml",
    host: "https://claudiabenassuly.com.br",
  };
}
