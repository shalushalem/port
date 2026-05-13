import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com";
  const routes = [
    "",
    "/ai-developer",
    "/freelance-ai-engineer",
    "/full-stack-ai-developer",
    "/projects",
    "/case-studies",
    "/blog"
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date()
  }));
}
