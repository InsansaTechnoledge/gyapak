import React, { useState } from "react";

const SocialGroupsJoin = () => {
  const [links] = useState({
    whatsapp: "https://whatsapp.com/channel/0029Vb5pMSm6buMNuc5uLH1C",
    telegram: "https://t.me/gyapakdaily",
  });

  const [copied, setCopied] = useState({});

  const copyToClipboard = (platform) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(links[platform]);
    setCopied({ [platform]: true });
    setTimeout(() => setCopied({}), 2000);
  };

  const joinGroup = (platform) => {
    window.open(links[platform], "_blank");
  };

  const platforms = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      iconColor: "text-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700",
      pillColor: "bg-green-100 text-green-700",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      ),
      members: "450+ members",
      activity: "Very active community with daily alerts.",
      benefits: ["Instant job updates", "Doubt support", "Rich media & PDFs"],
    },
    {
      id: "telegram",
      name: "Telegram",
      iconColor: "text-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      pillColor: "bg-blue-100 text-blue-700",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.768-.546 3.462-.768 4.59-.101.504-.497 1.245-.825 1.275-.751.061-1.348-.486-2.001-.953-.985-.67-1.547-1.08-2.507-1.731-.995-.673-.322-1.064.218-1.683.143-.164 2.646-2.483 2.692-2.691.007-.027.015-.126-.46-.18-.06-.054-.148-.033-.211-.021-.09.022-1.514.968-4.271 2.839-.405.278-.771.41-1.099.4-.36-.012-1.051-.207-1.566-.378-.631-.204-1.125-.312-1.084-.661.024-.181.361-.367 1.002-.558 3.908-1.749 6.504-2.902 7.78-3.459.74-.323 1.685-.755 2.671-.62.308.042.637.304.703.618.066.322.015 1.029-.089 1.512z" />
        </svg>
      ),
      members: "320+ members",
      activity: "Daily posts and pinned resources.",
      benefits: ["Secure updates", "File sharing", "Pinned preparation material"],
    },
  ];

  return (
    <section className="py-12 px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Join our Gyapak Communities
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Get daily government exam notifications, doubt support and
            preparation resources directly on WhatsApp & Telegram.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 ${platform.iconColor}`}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {platform.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {platform.members} · {platform.activity}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${platform.pillColor}`}
                >
                  Free to join
                </span>
              </div>

              {/* Benefits */}
              <ul className="mb-4 space-y-1.5">
                {platform.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Buttons + link */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => joinGroup(platform.id)}
                  className={`w-full ${platform.buttonColor} text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5`}
                >
                  Join {platform.name} Group
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50">
                  <span className="flex-1 text-[11px] text-gray-500 truncate">
                    {links[platform.id]}
                  </span>
                  <button
                    onClick={() => copyToClipboard(platform.id)}
                    className={`text-[11px] font-medium px-3 py-1 rounded-md border ${
                      copied[platform.id]
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {copied[platform.id] ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-xl mx-auto">
            We only share exam-related updates and resources. No spam. You can
            leave the group anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialGroupsJoin;
