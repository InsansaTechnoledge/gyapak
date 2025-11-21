import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { getTemplateHtml } from "./vacenciesTemplate.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function generateVacenciesPdf(allVacencies) {

  let browser;

  try {
    if (!allVacencies?.length) throw new Error("Empty vacancy list.");

    // Build all sections using map
    const contentHTML = allVacencies
      .map(v => getVacancyBlock(v))
      .join("");

    // Insert into template
    const finalHTML = getTemplateHtml().replace("{{content}}", contentHTML);

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(finalHTML, { waitUntil: "networkidle0" });

    const pdfBuffer =  await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
      <div style="width:100%; text-align:center; font-size:9px; color:#888; font-family:sans-serif;">
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>`,
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    return {success:true, pdfBuffer};

  }
  catch (e){
    console.log(e);

    return {success:false, error:e};

  }
  finally {
    if (browser) await browser.close();
  }
}


function getVacancyBlock(v) {
return `
<div class="single-vacancy mb-10">

  <h1 class="text-2xl font-bold uppercase text-center mb-1 text-purple-600">
    ${v.name}
  </h1>

  <p class="text-center text-sm text-gray-500 mb-5">
    Type: ${v.event_type}
  </p>

  <!-- BASIC INFO -->
  <div class="mb-6 pb-4 border-b">
    <h3 class="text-lg font-semibold mb-2">Basic Information</h3>
    <table class="w-full border border-gray-600 text-sm">
      <tr>
        <th class="border p-2 bg-gray-100">Organization</th>
        <td class="border p-2">${v.organization_name || ""}</td>
      </tr>
      <tr>
        <th class="border p-2 bg-gray-100">Notification Date</th>
        <td class="border p-2">${v.date_of_notification}</td>
      </tr>
      <tr>
        <th class="border p-2 bg-gray-100">Application Start</th>
        <td class="border p-2">${v.date_of_commencement}</td>
      </tr>
      <tr>
        <th class="border p-2 bg-gray-100">Application End</th>
        <td class="border p-2">${v.end_date}</td>
      </tr>
      <tr>
        <th class="border p-2 bg-gray-100">Apply Link</th>
        <td class="border p-2 break-all">
          <a href="${v.apply_link}" class="text-blue-600 underline">
            ${v.apply_link}
          </a>
        </td>
      </tr>
    </table>
  </div>

  <!-- BRIEF DETAILS -->
  
  
${
  v.briefDetails
    ? `
      <div class="mb-6 pb-4 border-b">
        <h3 class="text-lg font-semibold mb-2">Brief Details</h3>
        <p class="text-gray-700">${v.briefDetails}</p>
      </div>
    `
    : ""
}

    
    <!-- DOCUMENT LINKS -->
    <div class="mb-6 pb-4 border-b">
    <h3 class="text-lg font-semibold mb-2">Documents</h3>

    ${
      v.document_links?.length
        ? `<ul class="list-disc pl-5">
             ${v.document_links.map(d => `<li><a href="${d}" class="underline text-blue-600">${d}</a></li>`).join("")}
           </ul>`
        : `<p class="text-gray-600 italic">No documents provided.</p>`
    }
  </div>

  <!-- DETAILS TABLE -->
  <div class="mb-6 pb-4 border-b">
    <h3 class="text-lg font-semibold mb-2">Detailed Information</h3>
    <table class="w-full border border-gray-600 text-sm">
      <tr>
        <th class="border p-2 bg-gray-100">Field</th>
        <th class="border p-2 bg-gray-100">Value</th>
      </tr>

      ${Object.entries(v.details || {})
        .map(
          ([key, value]) => `
            <tr>
              <td class="border p-2 font-semibold">${key}</td>
              <td class="border p-2">${Array.isArray(value) ? value.join(", ") : value}</td>
            </tr>
          `
        )
        .join("")
      }

    </table>
  </div>

</div>

<div class="page-break"></div>
`;
}
