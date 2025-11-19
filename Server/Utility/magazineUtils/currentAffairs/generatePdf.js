import puppeteer from "puppeteer";
import fs from "fs"
import path from "path";
import { getTemplateHtml } from './magazineTemplate.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



function truncateText(text, maxLength = 900){
  if(!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...':text;
}


function generateArticleLink(publishedDate, title) {
  // Format date as YYYY-MM-DD
  const date = new Date(publishedDate);
  const formattedDate = date.toISOString().split("T")[0]; // e.g. "2025-10-29"

  // Slugify title — convert to lowercase, replace spaces/symbols
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove punctuation/symbols
    .replace(/\s+/g, "-");    // spaces -> dashes

  return `https://gyapak.in/current-affairs/${formattedDate}/${slug}`;
}

export default async function generateMagazinePdf(allCurrentAffairs) {

  // For simplicity, assume only one "week" batch per generation
  const { publishedDate, affair } = allCurrentAffairs[0];

  const weekDate = new Date(publishedDate);
  const formattedWeek = weekDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  let html = getTemplateHtml();
  html = html.replace("{{week}}", formattedWeek);

  const tocHTML = affair
    .map(
      (item, idx) => `
        <li class="flex justify-between border-b border-gray-200 pb-2">
          <span class="font-medium text-gray-800">${idx + 1}. ${item.title}</span>
          <span class="text-brandPurple">Pg. ${idx + 3}</span>
        </li>`
    )
    .join("");

  const articlesHTML = affair
    .map((article) => {
      const truncatedContent = truncateText(article.content);
      const imageSrc = article?.imageUrl || "";
      const articleLink = generateArticleLink(publishedDate, article.title);


      return `
        <article class="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 no-break transition-all">
          <header class="flex justify-between items-center text-[12px] text-gray-500 mb-3 tracking-wide">
            <span>${formattedWeek}</span>
            <span class="text-brandPurple font-medium uppercase">${article.category || ""}</span>
          </header>

          <h2 class="text-[20px] font-semibold text-gray-900 leading-snug mb-4 border-l-4 border-brandPurple pl-3">
            ${article.title}
          </h2>

          <div class="relative text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">
            ${imageSrc
              ? `<img src="${imageSrc}" alt="article image"
                 class="float-none mx-auto my-6 w-[60%] h-auto object-cover rounded-xl border border-gray-200 shadow-md block" />`
              : ""}
            ${truncatedContent}
          </div>

          <div class='flex justify-center'>
          <a href="${articleLink}" class="block text-purple-600 text-sm mt-4">Read on Gyapak</a>
          </div>
        </article>
      `;
    })
    .join("");

  // Inject into template
  html = html.replace(
    '<ul id="toc"></ul>',
    `<ul id="toc" class="space-y-3 text-gray-700 text-sm">${tocHTML}</ul>`
  );
  html = html.replace(
    `<section id="articles"></section>`,
    `<section id="articles" class="page-break p-12 space-y-6">${articlesHTML}</section>`
  );

  // Generate PDF 
  // const outputDir = path.join(__dirname, "output");
  // if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width:100%; text-align:center; font-size:9px; color:#888; font-family:sans-serif;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>`,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" }
    });

    return pdfBuffer;


  } catch (err) {
    console.error("Error generating PDF:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}
