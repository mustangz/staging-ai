import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://wnetrzeai.pl",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://wnetrzeai.pl/staging",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://wnetrzeai.pl/portfolio",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://wnetrzeai.pl/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
