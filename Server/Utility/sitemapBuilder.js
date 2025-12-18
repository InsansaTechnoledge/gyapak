// utils/sitemapBuilder.js
const escapeXml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const buildUrlset = (urls) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url>
  <loc>${escapeXml(u.loc)}</loc>
  ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
  ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ""}
  ${u.priority ? `<priority>${u.priority}</priority>` : ""}
</url>`
  )
  .join("\n")}
</urlset>`;
};

export const buildSitemapIndex = (sitemaps) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap-index.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (s) => `<sitemap>
  <loc>${escapeXml(s.loc)}</loc>
  ${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ""}
</sitemap>`
  )
  .join("\n")}
</sitemapindex>`;
};