// src/components/events/WhatsAppShare.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Utility: best-effort pickers (adjust field names to your API shape)
 */
function pickTitle(ev) {
  return ev?.title || ev?.name || ev?.eventTitle || ev?.exam?.title || "Event";
}
function pickDates(ev) {
  // Try some common shapes
  const start =
    ev?.date ||
    ev?.startDate ||
    ev?.start_date ||
    ev?.important_dates?.apply_start ||
    ev?.exam?.startDate ||
    ev?.exam?.date ||
    null;

  const end =
    ev?.endDate ||
    ev?.end_date ||
    ev?.important_dates?.apply_end ||
    ev?.exam?.endDate ||
    null;

  return { start, end };
}
function pickLocation(ev) {
  return ev?.location || ev?.city || ev?.exam?.location || "";
}
function pickOfficialLink(ev) {
  const link =
    ev?.official_link ||
    ev?.official_url ||
    ev?.url ||
    ev?.exam?.official_link ||
    (Array.isArray(ev?.official_links) ? ev.official_links[0] : null);
  return link || "";
}
function pickId(ev) {
  return ev?._id || ev?.id || ev?.eventId || ev?.exam?._id || "";
}
/**
 * Build a default share text (keep it under WA's practical limits)
 */
function buildShareText(ev, portalLinkBase) {
  const title = pickTitle(ev);
  const { start, end } = pickDates(ev);
  const loc = pickLocation(ev);
  const official = pickOfficialLink(ev);
  const id = pickId(ev);

  // If you have a public portal page per event, compose it:
  const portalLink = portalLinkBase && id ? `${portalLinkBase.replace(/\/$/, "")}/event/${id}` : "";

  const lines = [
    `📢 ${title}`,
    start || end ? `🗓️ ${[start, end].filter(Boolean).join(" → ")}` : "",
    loc ? `📍 ${loc}` : "",
    portalLink ? `🔗 Details: ${portalLink}` : "",
    official ? `🌐 Official: ${official}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

/**
 * Normalize a phone to digits-only for wa.me
 */
function normalizePhone(input) {
  if (!input) return "";
  return String(input).replace(/[^\d]/g, "");
}

/**
 * Build a WhatsApp URL (works on mobile & desktop)
 * - If phone exists: wa.me/<phone>?text=...
 * - Else: wa.me/?text=...
 */
function buildWhatsAppURL({ text, phone }) {
  const enc = encodeURIComponent(text || "");
  const p = normalizePhone(phone);
  if (p) return `https://wa.me/${p}?text=${enc}`;
  return `https://wa.me/?text=${enc}`;
}

const WhatsAppShare = ({ eventData, portalLinkBase }) => {
  const [phone, setPhone] = useState(""); // optional recipient phone with country code (e.g., 9198XXXXXXXX)
  const [message, setMessage] = useState("");

  // Build default message when event changes
  const defaultMsg = useMemo(() => buildShareText(eventData, portalLinkBase), [eventData, portalLinkBase]);

  useEffect(() => {
    setMessage(defaultMsg);
  }, [defaultMsg]);

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppURL({ text: message, phone });
    // open in new tab/window
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      // Pop-up blocked: copy fallback
      navigator.clipboard?.writeText(message).catch(() => {});
      alert("Pop-up blocked. Message copied to clipboard — paste it in WhatsApp.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      alert("Message copied!");
    } catch {
      alert("Copy failed. Select and copy the text manually.");
    }
  };

  return (
    <div className="mt-8 rounded-lg border border-purple-300 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-lg font-semibold text-purple-700">Share on WhatsApp</h3>
        <div className="flex items-center gap-2">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Recipient phone (e.g. 9198XXXXXXXX)"
            className="border-2 border-purple-600 rounded-md p-2 min-w-[260px]"
          />
          <button
            onClick={handleOpenWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Open WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Copy Message
          </button>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        className="w-full border-2 border-purple-600 rounded-md p-2 font-mono text-sm"
        placeholder="Your WhatsApp message…"
      />

      <p className="text-xs text-gray-500">
        Tip: Leave phone blank to just open WhatsApp with the message. Enter an international-format number (no +, only
        digits) to preselect a recipient.
      </p>
    </div>
  );
};

export default WhatsAppShare;
