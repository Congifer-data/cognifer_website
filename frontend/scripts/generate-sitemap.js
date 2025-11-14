// frontend/scripts/generate-sitemap.js
// Writes public/sitemap.xml with only: /, /scorecard, /about, /contact

import fs from "fs/promises";
import path from "path";

// Use your real production domain
const SITE = "https://www.cognifer.co.ke";

const routes = [
  { url: "/", priority: 1.0 },
  { url: "/scorecard", priority: 0.8 },
  { url: "/about", priority: 0.6 },
  { url: "/contact", priority: 0.6 },
];

async function main() {
  try {
    const now = new Date().toISOString();
    const items = routes
      .map(
        (r) => `
  <url>
    <loc>${SITE}${r.url}</loc>
    <lastmod>${now}</lastmod>
    <priority>${r.priority}</priority>
  </url>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`.trim() + "\n";

    const publicDir = path.join(process.cwd(), "public");
    await fs.mkdir(publicDir, { recursive: true });
    const outPath = path.join(publicDir, "sitemap.xml");
    await fs.writeFile(outPath, xml, "utf8");

    console.log(`sitemap.xml written to ${outPath}`);
    console.log("Routes included:", routes.map(r => r.url).join(", "));
  } catch (err) {
    console.error("Failed to generate sitemap:", err);
    process.exitCode = 1;
  }
}

main();
