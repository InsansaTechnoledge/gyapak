import React, { useMemo, useState } from "react";
import {
  WhatsAppComponentDescription,
  WhatsAppComponentHeaderCapsule,
  WhatsAppComponentNote,
  WhatsAppComponentTitle,
} from "../../constants/Constants";
import {
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SocialGroupsJoin = () => {
  const links = useMemo(
    () => ({
      whatsapp: "https://whatsapp.com/channel/0029Vb5pMSm6buMNuc5uLH1C",
      telegram: "https://t.me/gyapakdaily",
    }),
    []
  );

  const [copied, setCopied] = useState({});

  const copyToClipboard = async (platform) => {
    const text = links[platform];
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied({ [platform]: true });
      setTimeout(() => setCopied({}), 1800);
    } catch {
      // ignore silently
    }
  };

  const joinGroup = (platform) => {
    window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  const platforms = useMemo(
    () => [
      {
        id: "whatsapp",
        name: "WhatsApp",
        accent: "green", // only for tiny accents
        badge: "Fastest alerts",
        members: "450+ members",
        activity: "Very active community with daily alerts.",
        benefits: ["Instant job updates", "Doubt support", "Rich media & PDFs"],
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        ),
      },
      {
        id: "telegram",
        name: "Telegram",
        accent: "blue",
        badge: "Pinned resources",
        members: "320+ members",
        activity: "Daily posts and pinned resources.",
        benefits: ["Secure updates", "File sharing", "Pinned preparation material"],
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.768-.546 3.462-.768 4.59-.101.504-.497 1.245-.825 1.275-.751.061-1.348-.486-2.001-.953-.985-.67-1.547-1.08-2.507-1.731-.995-.673-.322-1.064.218-1.683.143-.164 2.646-2.483 2.692-2.691.007-.027.015-.126-.46-.18-.06-.054-.148-.033-.211-.021-.09.022-1.514.968-4.271 2.839-.405.278-.771.41-1.099.4-.36-.012-1.051-.207-1.566-.378-.631-.204-1.125-.312-1.084-.661.024-.181.361-.367 1.002-.558 3.908-1.749 6.504-2.902 7.78-3.459.74-.323 1.685-.755 2.671-.62.308.042.637.304.703.618.066.322.015 1.029-.089 1.512z" />
          </svg>
        ),
      },
    ],
    []
  );

  const accentChip = (accent) => {
    // keep identity but not dominate; theme stays purple
    if (accent === "green") return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    if (accent === "blue") return "bg-sky-50 text-sky-700 ring-sky-100";
    return "bg-gray-50 text-gray-700 ring-gray-100";
  };

  return (
    <section className="py-14 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full light-site-color-3 main-site-text-color ring-1  px-3 py-1 text-xs font-semibold">
            {WhatsAppComponentHeaderCapsule}
          </div>

          <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight utility-site-color">
            {WhatsAppComponentTitle}
          </h2>

          <p className="mt-2 text-sm md:text-base utility-secondary-color max-w-2xl mx-auto">
            {WhatsAppComponentDescription}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs utility-secondary-color">
            <span className="inline-flex items-center gap-2 rounded-full  ring-1 ring-gray-200 px-3 py-1">
              <ShieldCheck className="h-4 w-4 main-site-text-color" />
              No spam • Exam-only updates
            </span>
            <span className="inline-flex items-center gap-2 rounded-full ring-1 ring-gray-200 px-3 py-1">
              <span className="h-2 w-2 rounded-full main-site-text-color" />
              Verified links & daily alerts
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="group rounded-3xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full main-site-color" />

              <div className="p-6">
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl light-site-color-3 flex items-center justify-center main-site-text-color">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold utility-secondary-color leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-xs utility-secondary-color-2 mt-0.5">
                        {p.members} • {p.activity}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full ring-1 ${accentChip(
                      p.accent
                    )}`}
                  >
                    {p.badge}
                  </span>
                </div>

                {/* Benefits */}
                <ul className="mt-5 space-y-2">
                  {p.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm utility-secondary-color">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full main-site-color" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => joinGroup(p.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl main-site-color  px-4 py-2.5 text-sm font-semibold secondary-site-text-color hover:main-site-color-hover transition"
                  >
                    Join now <ExternalLink className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(p.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold main-site-text-color  hover:light-site-color-3 transition"
                  >
                    {copied[p.id] ? (
                      <>
                        Copied <Check className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Copy link <Copy className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Link row */}
                <div className="mt-4 rounded-2xl light-site-color-3  px-3 py-2">
                  <p className="text-[11px] text-gray-500 truncate">{links[p.id]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs utility-secondary-color max-w-xl mx-auto">
            {WhatsAppComponentNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialGroupsJoin;
