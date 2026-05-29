import fs from "fs";
import path from "path";

// Default settings
let siteUrl = "https://beyond.openminded.vercel.app";
let generateRobotsTxt = true;

// Parse next-sitemap.config.js safely without triggering module/CJS/ESM conflicts
try {
  const configPath = path.join(process.cwd(), "next-sitemap.config.js");
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, "utf8");
    const urlMatch = content.match(/siteUrl:\s*['"]([^'"]+)['"]/);
    if (urlMatch) {
      siteUrl = urlMatch[1].replace(/\/$/, ""); // Remove trailing slash
    }
    const robotsMatch = content.match(/generateRobotsTxt:\s*(true|false)/);
    if (robotsMatch) {
      generateRobotsTxt = robotsMatch[1] === "true";
    }
    console.log(`\nParsed next-sitemap.config.js loaded:`);
    console.log(`- Site URL: ${siteUrl}`);
    console.log(`- Generate Robots.txt: ${generateRobotsTxt}\n`);
  }
} catch (error) {
  console.warn("Could not read next-sitemap.config.js, using defaults.", error);
}

const lastMod = new Date().toISOString().split("T")[0];

// Define static routes for our React SPA
const routes = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "/auth", priority: "0.8", changefreq: "weekly" }
];

// Generate sitemap XML
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`;

// Helper to write files safely
const writeOutput = (dirName, fileName, content) => {
  const dirPath = path.join(process.cwd(), dirName);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, fileName), content, "utf8");
  console.log(`Successfully generated /${dirName}/${fileName}`);
};

// Write sitemap to /public
writeOutput("public", "sitemap.xml", sitemapXml);
if (generateRobotsTxt) {
  writeOutput("public", "robots.txt", robotsTxt);
}

// Write to /dist as well if it exists
if (fs.existsSync(path.join(process.cwd(), "dist"))) {
  writeOutput("dist", "sitemap.xml", sitemapXml);
  if (generateRobotsTxt) {
    writeOutput("dist", "robots.txt", robotsTxt);
  }
}

console.log("Automatic sitemap and robots.txt generation completed!\n");
