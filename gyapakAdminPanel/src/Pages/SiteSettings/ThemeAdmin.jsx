import React, { useEffect, useMemo, useState } from "react";
import { Palette, Save, Eye, RefreshCw, Plus, CheckCircle2, Copy } from "lucide-react";
import {
  activateTheme,
  getActiveTheme,
  listThemes,
  upsertTheme,
} from "../../Services/theme.service";

const SIMPLE_FIELDS = [
  { key: "--main-site-color", label: "Primary Color" },
  { key: "--main-site-color-hover", label: "Primary Hover" },
  { key: "--main-site-color-2", label: "Secondary Color" },
  { key: "--main-nav-bar-color", label: "Navbar Color" },

  { key: "--light-site-color", label: "Background" },
  { key: "--light-site-color-2", label: "Background Soft" },

  { key: "--main-site-text-color", label: "Text Primary" },
  { key: "--utility-site-color", label: "Text Utility" },

  { key: "--main-site-border-color", label: "Border" },
  { key: "--main-site-text-error-color", label: "Error Color" },
];

// Advanced fields (everything else you already had)
const ALL_FIELDS = [
  ...SIMPLE_FIELDS,
  { key: "--main-footer-from", label: "Footer From" },
  { key: "--main-footer-to", label: "Footer To" },

  { key: "--light-site-color-3", label: "Background 3" },
  { key: "--light-site-color-4", label: "Background 4" },
  { key: "--light-site-color-5", label: "Background 5" },

  { key: "--main-site-text-color-2", label: "Text Secondary" },
  { key: "--secondary-site-text-color", label: "Text Contrast" },

  { key: "--main-site-border-color-2", label: "Border 2" },
  { key: "--main-site-border-color-3", label: "Border 3" },
  { key: "--main-site-border-color-4", label: "Border 4" },

  { key: "--main-dark-border-color", label: "Dark Border 1" },
  { key: "--main-dark-border-color-2", label: "Dark Border 2" },

  { key: "--utility-secondary-color", label: "Utility Secondary" },
  { key: "--utility-secondary-color-2", label: "Utility Tertiary" },
  { key: "--utility-scondary-color-3", label: "Utility Quaternary" },

  { key: "--support-component-bg-color", label: "Support BG" },
  { key: "--support-component-bg-color-green", label: "Success BG" },
];

// Optional gradient variable (recommended)
const GRADIENT_FIELDS = [
  { key: "--main-footer-gradient", label: "Footer Gradient" }, // string like linear-gradient(...)
];

const rgbToHex = (rgb) => {
  if (!rgb || typeof rgb !== "string") return "#000000";
  const parts = rgb.trim().split(/\s+/);
  if (parts.length !== 3) return "#000000";
  const [r, g, b] = parts.map((x) => Math.max(0, Math.min(255, parseInt(x) || 0)));
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "0 0 0";
  return `${parseInt(m[1], 16)} ${parseInt(m[2], 16)} ${parseInt(m[3], 16)}`;
};

export default function ThemeAdmin() {
//   const apiBaseUrl = "https://adminpanel.gyapak.in";
  const apiBaseUrl = "http://localhost:3000";

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState(null);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [slug, setSlug] = useState("new-theme");
  const [name, setName] = useState("New Theme");

  // vars: rgb variables + optional gradient variables
  const [vars, setVars] = useState(() => {
    const base = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, "0 0 0"]));
    const grads = Object.fromEntries(GRADIENT_FIELDS.map((f) => [f.key, ""]));
    return { ...base, ...grads };
  });

  const applyTheme = (varsObj = {}) => {
    const root = document.documentElement;
    for (const [k, v] of Object.entries(varsObj || {})) {
      if (typeof k === "string" && k.startsWith("--") && typeof v === "string") {
        root.style.setProperty(k, v.trim());
      }
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const [themesRes, activeRes] = await Promise.all([
        listThemes(apiBaseUrl),
        getActiveTheme(apiBaseUrl),
      ]);
      setThemes(themesRes?.themes || []);
      setActiveTheme(activeRes?.theme || null);

      if (activeRes?.theme?.vars) applyTheme(activeRes.theme.vars);
    } catch (e) {
      console.log("load failed:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const resetForm = () => {
    setSlug("new-theme");
    setName("New Theme");
    const base = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, "0 0 0"]));
    const grads = Object.fromEntries(GRADIENT_FIELDS.map((f) => [f.key, ""]));
    setVars({ ...base, ...grads });
  };

  const copyFromActive = () => {
    const current = activeTheme?.vars || {};
    const base = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, "0 0 0"]));
    const grads = Object.fromEntries(GRADIENT_FIELDS.map((f) => [f.key, ""]));
    setVars({ ...base, ...grads, ...current });
  };

  const onEditTheme = (t) => {
    setSlug(t.slug);
    setName(t.name || "");
    const base = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, "0 0 0"]));
    const grads = Object.fromEntries(GRADIENT_FIELDS.map((f) => [f.key, ""]));
    setVars({ ...base, ...grads, ...(t.vars || {}) });
  };

  const onSave = async () => {
    try {
      await upsertTheme(apiBaseUrl, slug, { name, vars });
      await load();
    } catch (e) {
      console.log("save failed:", e?.message);
    }
  };

  const onActivate = async (t) => {
    try {
      await activateTheme(apiBaseUrl, t._id);
      await load();
    } catch (e) {
      console.log("activate failed:", e?.message);
    }
  };

  const visibleFields = showAdvanced ? ALL_FIELDS : SIMPLE_FIELDS;

  return (
    <div className="min-h-screen mt-32 p-4 sm:p-6 bg-slate-50">
      <div className=" mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold text-slate-900">Theme Studio</div>
              <div className="text-sm text-slate-500">
                Create → Preview → Save → Activate
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            {/* <button
              onClick={() => applyTheme(vars)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              <Eye className="w-4 h-4" /> Preview
            </button> */}

            <button
              onClick={onSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: themes */}
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-slate-900">Themes</div>
              <div className="flex gap-2">
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
                  title="New theme"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
                <button
                  onClick={copyFromActive}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
                  title="Copy from active"
                >
                  <Copy className="w-4 h-4" /> Copy active
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
              {themes.map((t) => (
                <div
                  key={t._id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3
                    ${t.isActive ? "border-purple-400 bg-purple-50" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <button onClick={() => onEditTheme(t)} className="text-left flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{t.name}</div>
                    <div className="text-xs text-slate-500 truncate">{t.slug}</div>
                  </button>

                  {t.isActive ? (
                    <div className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </div>
                  ) : (
                    <button
                      onClick={() => onActivate(t)}
                      className="px-3 py-2 rounded-xl bg-purple-600 text-white text-sm hover:bg-purple-700"
                    >
                      Activate
                    </button>
                  )}
                </div>
              ))}
              {!loading && themes.length === 0 && (
                <div className="text-sm text-slate-500 text-center py-10">
                  No themes yet. Click <b>New</b> to create one.
                </div>
              )}
            </div>
          </div>

          {/* Right: editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="font-semibold text-slate-900">Editor</div>
                <div className="text-sm text-slate-500">
                  Start with basic colors. Turn on Advanced only if needed.
                </div>
              </div>

              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
              >
                {showAdvanced ? "Hide Advanced" : "Show Advanced"}
              </button>
            </div>

            {/* Name + slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-sm font-medium text-slate-700">Theme Name</label>
                <input
                  className="mt-2 w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Christmas Red"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Slug</label>
                <input
                  className="mt-2 w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 font-mono"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  placeholder="e.g. christmas"
                />
              </div>
            </div>

            {/* Gradient section (optional) */}
            <div className="mb-5 p-4 border rounded-xl bg-slate-50">
              <div className="text-sm font-semibold text-slate-900 mb-1">Optional: Gradient</div>
              <div className="text-sm text-slate-500 mb-3">
                Use this only if you created CSS like: <code>background-image: var(--main-footer-gradient)</code>
              </div>

              <input
                className="w-full px-4 py-2.5 border rounded-xl font-mono text-sm"
                value={vars["--main-footer-gradient"] || ""}
                onChange={(e) => setVars((p) => ({ ...p, ["--main-footer-gradient"]: e.target.value }))}
                placeholder='e.g. linear-gradient(to bottom, rgb(17 24 39), rgb(0 0 0))'
              />
            </div>

            {/* Color controls */}
            <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
              {visibleFields.map((f) => {
                const current = vars[f.key] || "0 0 0";
                const hex = rgbToHex(current);

                return (
                  <div
                    key={f.key}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">{f.label}</div>
                      <div className="text-xs text-slate-500 font-mono">{f.key}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border"
                        style={{ backgroundColor: `rgb(${current})` }}
                      />
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => {
                          const rgb = hexToRgb(e.target.value);
                          setVars((p) => ({ ...p, [f.key]: rgb }));
                        }}
                        className="w-16 h-10 rounded-lg border cursor-pointer"
                      />
                      <input
                        value={current}
                        onChange={(e) => setVars((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-32 px-3 py-2 border rounded-xl font-mono text-xs"
                        placeholder="124 58 237"
                        title="R G B"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* <button
                onClick={() => applyTheme(vars)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </button> */}

              <button
                onClick={onSave}
                className="w-full sm:flex-1 px-5 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-semibold inline-flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Save Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
