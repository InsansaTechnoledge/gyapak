import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateSlugUrl } from "./slugGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const convertImageToBase64 = async (filePath) => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    console.error("Failed to load image:", error);
    return null;
  }
};

/**
 * Converts UTC date to IST and formats it
 * @param {string} dateString - UTC date string
 * @returns {string} Formatted date in IST
 */

const formatDateOnlyIST = (dateString) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
/**
 * Formats date without time in IST
 * @param {string} dateString - UTC date string
 * @returns {string} Formatted date in IST
 */
const generateLink = (name, id, isNewTrue) => {
  if (!name || !id) {
    console.log("name required in generateLink function");
    return "";
  }
  const basePath = "/top-exams-for-government-jobs-in-india";
  return generateSlugUrl(name, id, basePath, isNewTrue);
};

/**
 * Generates a premium, user-friendly PDF report for urgent and soon events
 * @param {Object} reportData - The report data from the API
 */

export const generateReportPDF = async (
  reportData,
  outputDir = "./public/pdf"
) => {
  // Convert footer image to base64
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Convert images to base64
  const footerImagePath = path.join(__dirname, "../public/footer-text.png");
  const watermarkImagePath = path.join(__dirname, "../public/gyapak-logo.png");
  const coverPagePath = path.join(__dirname, "../public/expiry-jobs-cover.png");
  const gyapakLogo = path.join(__dirname, "../public/gyapak-white.png");

  const footerImageBase64 = await convertImageToBase64(footerImagePath);
  const watermarkImageBase64 = await convertImageToBase64(watermarkImagePath);
  const coverPagePathBase64 = await convertImageToBase64(coverPagePath);
  const gyapakLogoBase64 = await convertImageToBase64(gyapakLogo);
  // Create new PDF document with A4 size
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  if (coverPagePathBase64) {
    // Add cover image to fill the entire page
    doc.addImage(coverPagePathBase64, "PNG", 0, 0, pageWidth, pageHeight);
  }

  // Add a new page for the main content
  doc.addPage();

  let yPosition = margin;

  // Color palette - matching website gradient (purple-50 to indigo-50)
  const colors = {
    primary: [65, 31, 90], // Indigo-500
    secondary: [139, 92, 246], // Violet-500
    purpleLight: [250, 245, 255], // Purple-50
    indigoLight: [238, 242, 255], // Indigo-50
    critical: [99, 102, 241], // Red
    high: [249, 115, 22], // Orange
    medium: [34, 197, 94], // Green
    text: [31, 41, 55], // Dark gray
    lightBg: [249, 250, 251], // Light gray
    white: [255, 255, 255],
  };

  // ============================================
  // HEADER SECTION - Premium Design
  // ============================================

  // Add gradient-like header background
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 50, "F");

  // Add decorative accent bar
  doc.setFillColor(...colors.critical);
  doc.rect(0, 48, pageWidth, 2, "F");

  // Add company logo (top left of header)
  if (gyapakLogoBase64) {
    const logoWidth = 25; // Logo width in mm
    const logoHeight = 11; // Logo height in mm
    const logoX = margin;
    const logoY = (50 - logoHeight) / 2; // Vertically center in 50mm header
    doc.addImage(gyapakLogoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
  }

  // Main Title (right-aligned at rightmost side)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16); // Reduced from 22 for better fit
  doc.setFont("helvetica", "bold");

  const titleText =
    "Last Date to Apply for Online & Offline Government Jobs Applications";

  const titleStartX = margin + 35; // Space from logo (was implicitly margin)
  const maxWidth = pageWidth - titleStartX - margin; // available width for title

  const lines = doc.splitTextToSize(titleText, maxWidth);

  // Right-aligned, 2-line rendering
  const lineHeight = 6; // Line spacing
  const totalTextHeight = lines.length * lineHeight;
  const textStartY = (50 - totalTextHeight) / 2 + 4; // Vertically center text block

  lines.forEach((line, index) => {
    const lineWidth = doc.getTextWidth(line);
    doc.text(
      line,
      pageWidth - margin - lineWidth,
      textStartY + index * lineHeight
    );
  });

  // Subtitle (right-aligned)
  // doc.setFontSize(12);
  // doc.setFont("helvetica", "normal");
  // const subtitleText = "Urgent & Upcoming Opportunities";
  // const subtitleWidth = doc.getTextWidth(subtitleText);
  // doc.text(subtitleText, pageWidth - margin - subtitleWidth, 23);

  // Report metadata in header
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  const reportPeriod = `Period: ${formatDateOnlyIST(
    reportData.period.from
  )} - ${formatDateOnlyIST(reportData.period.to)}`;
  doc.text(reportPeriod, margin, 43);

  yPosition = 60;

  // ============================================
  // CRITICAL EVENTS TABLE
  // ============================================

  // After the summary cards section, combine both arrays
  if (
    reportData.upcomingEvents.urgent.length > 0 ||
    reportData.upcomingEvents.soon.length > 0
  ) {
    yPosition += 12;

    const combinedTableData = [
      ...reportData.upcomingEvents.urgent.map((event, index) => {
        const fullUrl = `https://gyapak.in${generateLink(
          event.name,
          event?._id,
          event?.isNewTrue
        )}`;
        return [
          index + 1,
          event.name || "N/A",
          event.organization_id?.abbreviation || "N/A",
          // event.event_type || "N/A",
          formatDateOnlyIST(event.end_date),
          `${event.daysRemaining} day${event.daysRemaining !== 1 ? "s" : ""}`,
          fullUrl,
        ];
      }),
      ...reportData.upcomingEvents.soon.map((event, index) => {
        const fullUrl = `https://gyapak.in${generateLink(
          event.name,
          event?._id,
          event?.isNewTrue
        )}`;
        return [
          reportData.upcomingEvents.urgent.length + index + 1,
          event.name || "N/A",
          event.organization_id?.abbreviation || "N/A",
          // event.event_type || "N/A",
          formatDateOnlyIST(event.end_date),
          `${event.daysRemaining} day${event.daysRemaining !== 1 ? "s" : ""}`,
          fullUrl,
        ];
      }),
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [
        ["#", "Event Name", "Org", "End Date", "Expiring In", "Apply Link"],
      ],
      body: combinedTableData,
      theme: "grid",
      rowPageBreak: "avoid", // Prevent rows from splitting across pages
      headStyles: {
        fillColor: colors.critical,
        textColor: colors.white,
        fontSize: 9,
        fontStyle: "bold",
        halign: "left",
        cellPadding: 2, // Reduced from 4
      },
      bodyStyles: {
        fontSize: 8, // Reduced from 9
        cellPadding: 2, // Reduced from 5 - THIS IS KEY
        textColor: colors.text,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        minCellHeight: 8, // Add minimum height control
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center", fontStyle: "bold" },
        1: { cellWidth: 70 }, // Increased width since we removed a column
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: 28, halign: "center" }, // End Date - increased width
        4: {
          cellWidth: 18,
          halign: "center",
          fontStyle: "bold",
        },
        5: {
          cellWidth: 15,
          halign: "center",
          textColor: colors.primary,
          fontStyle: "normal",
          overflow: "hidden",
        },
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        addWatermark(doc, pageWidth, pageHeight, watermarkImageBase64);
        addFooter(doc, pageWidth, pageHeight, margin, footerImageBase64);
      },
      didDrawCell: (data) => {
        // Make links clickable
        if (data.column.index === 5 && data.cell.section === "body") {
          const link = data.cell.raw;
          if (link && link !== "N/A") {
            // IMPORTANT: Draw background FIRST to cover the long URL text
            const bgColor =
              data.row.index % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
            doc.setFillColor(...bgColor);
            doc.rect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              "F"
            );

            // Now draw the "Link" text
            doc.setTextColor(...colors.primary);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");

            const displayText = "Link";
            const textX =
              data.cell.x +
              (data.cell.width - doc.getTextWidth(displayText)) / 2;
            const textY = data.cell.y + data.cell.height / 2 + 1.5;

            doc.textWithLink(displayText, textX, textY, { url: link });

            // Add underline
            const textWidth = doc.getTextWidth(displayText);
            doc.setDrawColor(...colors.primary);
            doc.setLineWidth(0.1);
            doc.line(textX, textY + 0.5, textX + textWidth, textY + 0.5);
          }
        }
      },
    });
  }

  // Add watermark and footer to last page if not already added
  addWatermark(doc, pageWidth, pageHeight, watermarkImageBase64);
  addFooter(doc, pageWidth, pageHeight, margin, footerImageBase64);

  // ============================================
  // SAVE PDF
  // ============================================

  const fileName = `Weekly_Events_Report.pdf`;
  const filePath = path.join(outputDir, fileName);

  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(filePath, pdfBuffer);

  console.log(`PDF generated successfully: ${filePath}`);
  return filePath;
};

/**
 * Adds a watermark image to the PDF page behind all content
 * @param {jsPDF} doc - The PDF document
 * @param {number} pageWidth - Width of the page
 * @param {number} pageHeight - Height of the page
 * @param {string} watermarkImageBase64 - Base64 encoded watermark image
 */
const addWatermark = (
  doc,
  pageWidth,
  pageHeight,
  watermarkImageBase64 = null
) => {
  if (!watermarkImageBase64) return;

  // Calculate watermark dimensions (adjust size as needed)
  const watermarkWidth = 120; // Adjust this value to change watermark size
  const watermarkHeight = 80; // Adjust this value to change watermark size

  // Center the watermark
  const x = (pageWidth - watermarkWidth) / 2;
  const y = (pageHeight - watermarkHeight) / 2;

  // Save the current graphics state
  doc.saveGraphicsState();

  // Set opacity for watermark (0.1 = 10% opacity, adjust as needed)
  doc.setGState(new doc.GState({ opacity: 0.1 }));

  // Add the watermark image
  doc.addImage(
    watermarkImageBase64,
    "PNG",
    x,
    y,
    watermarkWidth,
    watermarkHeight
  );

  // Restore the graphics state
  doc.restoreGraphicsState();
};

/**
 * Adds a professional footer to the PDF page
 * @param {jsPDF} doc - The PDF document
 * @param {number} pageWidth - Width of the page
 * @param {number} pageHeight - Height of the page
 * @param {number} margin - Page margin
 * @param {string} footerImageBase64 - Base64 encoded image of "Made with ❤️ by Gyapak"
 */
const addFooter = (
  doc,
  pageWidth,
  pageHeight,
  margin,
  footerImageBase64 = null
) => {
  const footerY = pageHeight - 15;

  // Footer background
  doc.setFillColor(249, 250, 251);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");

  // Footer line
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  // Footer text with image
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const pageNumber = `Page ${doc.internal.getCurrentPageInfo().pageNumber}`;

  // LEFT: Footer image or text - aligned to footerY
  if (footerImageBase64) {
    // Add the image (adjust width and height as needed)
    const imgWidth = 33;
    const imgHeight = 5;
    // Vertically center the image with the text
    const imgY = footerY - imgHeight / 2 - 1;
    doc.addImage(footerImageBase64, "PNG", margin, imgY, imgWidth, imgHeight);
  } else {
    // Fallback to text without emoji
    const footerText = "Made with ♥ by Gyapak";
    doc.text(footerText, margin, footerY);
  }

  // CENTER: Social Media Links - aligned to footerY
  doc.setFontSize(9);
  doc.setTextColor(59, 130, 246); // Blue color for links

  // Define social media links
  const socialLinks = [
    { label: "Website", url: "https://gyapak.in" },
    { label: "Twitter", url: "https://gyapak.in" },
    { label: "Instagram", url: "https://www.instagram.com/gyapak.in/" },
    { label: "Telegram", url: "https://t.me/gyapak" },
    {
      label: "WhatsApp",
      url: "https://whatsapp.com/channel/0029VaeePgu4dTnNdUwHXO2m",
    },
  ];

  // Calculate total width for centering
  const separator = " | ";
  let totalWidth = 0;
  socialLinks.forEach((link, index) => {
    totalWidth += doc.getTextWidth(link.label);
    if (index < socialLinks.length - 1) {
      totalWidth += doc.getTextWidth(separator);
    }
  });

  // Starting X position for centered links
  let currentX = (pageWidth - totalWidth) / 2;

  // Draw each social media link
  socialLinks.forEach((link, index) => {
    const linkWidth = doc.getTextWidth(link.label);

    // Add clickable link
    doc.textWithLink(link.label, currentX, footerY, { url: link.url });

    // Add underline
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.1);
    doc.line(currentX, footerY + 0.5, currentX + linkWidth, footerY + 0.5);

    currentX += linkWidth;

    // Add separator if not the last item
    if (index < socialLinks.length - 1) {
      doc.setTextColor(107, 114, 128); // Gray for separator
      doc.text(separator, currentX, footerY);
      currentX += doc.getTextWidth(separator);
      doc.setTextColor(59, 130, 246); // Back to blue for next link
    }
  });

  // RIGHT: Page number - aligned to footerY
  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.text(
    pageNumber,
    pageWidth - margin - doc.getTextWidth(pageNumber),
    footerY
  );
};
