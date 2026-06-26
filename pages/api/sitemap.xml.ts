import { NextApiHandler } from "next";

const SITE_URL = "https://www.savepoint.run";

const staticPaths = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/community/", priority: "0.8", changefreq: "daily" },
  { path: "/submit/", priority: "0.7", changefreq: "weekly" },
  { path: "/docs/", priority: "0.6", changefreq: "weekly" },
];

function generateSiteMap() {
  const urls = staticPaths
    .map(
      ({ path, priority, changefreq }) => `
    <url>
      <loc>${SITE_URL}${path}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

const handler: NextApiHandler = (req, res) => {
  res.setHeader("Content-Type", "text/xml");
  res.write(generateSiteMap());
  res.end();
};

export default handler;
