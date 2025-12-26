import React, { useMemo } from "react";

const toParagraphHtml = (htmlString = "") => {
  const normalized = String(htmlString).replace(/\r\n/g, "\n").trim();

  // If already has <p> tags, keep as is
  if (/<\s*p[\s>]/i.test(normalized)) return normalized;

  // Split by blank lines => paragraphs
  const parts = normalized
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  // Wrap each paragraph + keep single line breaks as <br/>
  return parts.map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("");
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
              // ✅ spacing between paragraphs
              "[&>p]:mb-4 sm:[&>p]:mb-5 md:[&>p]:mb-6",
              "[&>p:last-child]:mb-0",
              // optional: better justification
              "text-justify hyphens-auto",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
};

export default BriefSection;
