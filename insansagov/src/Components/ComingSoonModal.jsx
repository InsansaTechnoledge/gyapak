import { X, Sparkles } from "lucide-react";

export const ComingSoonModal = ({ open, onClose, label }) => {
  if (!open) return null;

  const title = label ? `${label} is coming soon` : "Coming soon";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        // click outside to close
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white border-2 main-site-border-color shadow-[var(--shadow-accertinity)] overflow-hidden animate-slide-up">
        {/* Top accent */}
        <div className="h-1 w-full main-site-color" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* <div className="h-10 w-10 rounded-xl light-site-color border main-site-border-color flex items-center justify-center">
                <Sparkles className="w-5 h-5 main-site-text-color" />
              </div> */}

              <div>
                <p className="font-extrabold utility-site-color text-lg leading-6">
                  {title}
                </p>
                <p className="text-xs utility-secondary-color mt-1">
                  We’re working on this feature. It will be available soon.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-xl border main-site-border-color light-site-color flex items-center justify-center hover:light-site-color-3 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4 utility-secondary-color" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-4 rounded-xl border main-site-border-color light-site-color-3 p-3">
            <p className="text-sm utility-site-color">
              Want this sooner? Keep checking updates on{" "}
              <span className="font-extrabold main-site-text-color">Gyapak</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border-2 main-site-border-color utility-site-color font-extrabold hover:light-site-color-3 transition"
            >
              Okay
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl main-site-color secondary-site-text-color font-extrabold main-site-color-hover transition"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
