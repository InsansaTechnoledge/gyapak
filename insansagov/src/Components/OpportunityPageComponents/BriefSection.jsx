import React, { useMemo } from "react";

const toParagraphHtml = (htmlString = "") => {
  const normalized = String(htmlString).replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";

  if (/<[a-z][\s\S]*>/i.test(normalized)) {
    let html = normalized;

    // Unwrap <ol>/<ul>/<table> from <p> wrappers
    html = html.replace(
      /<p>\s*(<(?:ol|ul|table)[\s\S]*?>)/gi,
      "$1"
    );
    html = html.replace(
      /(<\/(?:ol|ul|table)>)\s*<\/p>/gi,
      "$1"
    );

    return html;
  }

  const parts = normalized
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return parts
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
};

const BriefSection = ({ data }) => {
  const html = useMemo(() => {
    if (!data?.briefDetails) return "";
    return toParagraphHtml(data.briefDetails);
  }, [data?.briefDetails]);

  if (!html) return null;

  return (
    <div className="w-full py-4 sm:py-6 md:py-8">
      <div className="mx-auto px-3 sm:px-4 md:px-6">
        <div className="rounded-lg sm:rounded-xl py-5 sm:py-6 md:py-8 px-4 sm:px-5 md:px-10 shadow-sm light-site-color-3 border-2 main-site-border-color">
          <div
            className={[
              "max-w-none",
              "text-base sm:text-lg md:text-xl",
              "utility-site-color",
              "leading-relaxed",
              "text-justify hyphens-auto",

              // Paragraph spacing
              "[&>p]:mb-4 sm:[&>p]:mb-5 md:[&>p]:mb-6",
              "[&>p:last-child]:mb-0",

              // ✅ Lists styling
              "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4",
              "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4",
              "[&_li]:mb-1",

              // ✅ Links styling
              "[&_a]:text-blue-600 [&_a]:underline break-words",

              // ✅ Table styling
              "[&_table]:w-full [&_table]:border [&_table]:border-gray-200 [&_table]:border-collapse [&_table]:my-4",
              "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold",
              "[&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:text-sm",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default BriefSection;
