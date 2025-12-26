import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  UploadCloud,
  FileJson2,
  Copy,
  X,
  Download,
  Book,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../api/axiosConfig";

export const isResultNotification = (n) => {
  const hay = `${n?.type || ""} ${n?.category || ""} ${n?.title || ""} ${
    n?.summary || ""
  }`.toLowerCase();
  return hay.includes("result");
};

const buildDraftPayload = (n, getDocTime) => {
  return {
    kind: "result",
    title: n?.title || "",
    link: n?.link || "",
    description: "",
    resultDate: null, // can be "YYYY-MM-DD"
    isTentative: false,
  };
};

const downloadJson = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const deepClone = (v) => JSON.parse(JSON.stringify(v ?? null));

export default function ResultNotificationsPanel({
  items = [],
  title = "Results",
  uploadEndpoint = "/api/results/import",
  getDocTime,
  makeKey,
  todayKey,
  istDateKey,
}) {
  const [selected, setSelected] = useState(() => new Set());
  const [uploading, setUploading] = useState(false);

  // Drafts modal
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [draftMode, setDraftMode] = useState("selected"); // "selected" | "all"
  const [copied, setCopied] = useState(false);

  // ✅ Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDrafts, setEditDrafts] = useState([]);
  const [editError, setEditError] = useState("");

  const enriched = useMemo(() => {
    return (items || []).map((n) => {
      const key = makeKey(n);
      return {
        n,
        key,
        draft: buildDraftPayload(n, getDocTime),
      };
    });
  }, [items, getDocTime, makeKey]);

  const toggle = (k) => {
    setSelected((prev) => {
      const ns = new Set(prev);
      ns.has(k) ? ns.delete(k) : ns.add(k);
      return ns;
    });
  };

  const selectAll = () => setSelected(new Set(enriched.map((x) => x.key)));
  const clearAll = () => setSelected(new Set());

  const uploadRows = async (rows) => {
    if (!rows?.length) return;

    setUploading(true);
    try {
      await axiosInstance.post(`${uploadEndpoint}`, { rows });
      alert("Uploaded ✅");
    } catch (e) {
      console.error("Result upload failed:", e);
      alert("Upload failed ❌ (check endpoint/payload)");
    } finally {
      setUploading(false);
    }
  };

  const uploadOne = async (draft) => {
    await uploadRows([draft]);
  };

  // --- Drafts for modal
  const draftsAll = useMemo(() => enriched.map((x) => x.draft), [enriched]);
  const draftsSelected = useMemo(
    () => enriched.filter((x) => selected.has(x.key)).map((x) => x.draft),
    [enriched, selected]
  );

  const modalDrafts = draftMode === "all" ? draftsAll : draftsSelected;
  const modalJson = useMemo(
    () => JSON.stringify(modalDrafts, null, 2),
    [modalDrafts]
  );

  const openDraftModal = () => {
    setDraftMode(selected.size ? "selected" : "all");
    setCopied(false);
    setDraftModalOpen(true);
  };

  const closeDraftModal = () => {
    setDraftModalOpen(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(modalJson);
    setCopied(ok);
    if (ok) setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const suffix = draftMode === "all" ? "all" : "selected";
    downloadJson(`result-drafts-${suffix}.json`, modalDrafts);
  };

  // ✅ instead of uploading from Drafts modal, open edit modal
  const openEditModal = (drafts) => {
    setEditError("");
    setEditDrafts(deepClone(drafts || []));
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditDrafts([]);
    setEditError("");
  };

  const updateDraftField = (idx, field, value) => {
    setEditDrafts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removeDraft = (idx) => {
    setEditDrafts((prev) => prev.filter((_, i) => i !== idx));
  };

  const validateDrafts = (rows) => {
    if (!Array.isArray(rows)) return "Drafts must be an array.";
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (r?.kind !== "result") return `Row ${i + 1}: kind must be "result"`;
      if (!r?.title?.trim()) return `Row ${i + 1}: title is required`;
      if (!r?.link?.trim()) return `Row ${i + 1}: link is required`;
      if (r?.resultDate && !/^\d{4}-\d{2}-\d{2}$/.test(r.resultDate)) {
        return `Row ${i + 1}: resultDate must be YYYY-MM-DD or empty`;
      }
    }
    return "";
  };

  const finalUploadEdited = async () => {
    const err = validateDrafts(editDrafts);
    if (err) {
      setEditError(err);
      return;
    }

    await uploadRows(editDrafts);

    // Close both modals after upload
    closeEditModal();
    closeDraftModal();
    clearAll();
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
            <p className="text-[11px] text-slate-500">
              Result notifications only • draft → edit → final upload
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openDraftModal}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50"
            >
              <FileJson2 className="h-4 w-4" />
              View Drafts
            </button>

            <button
              onClick={selectAll}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
            >
              Select all
            </button>
            <button
              onClick={clearAll}
              className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              onClick={() => openEditModal(draftsSelected)} // ✅ open edit modal
              disabled={uploading || selected.size === 0}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              <Pencil className="h-4 w-4" />
              Edit & Upload ({selected.size})
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {enriched.length === 0 ? (
            <p className="text-sm text-slate-500">
              No result notifications found.
            </p>
          ) : (
            enriched.slice(0, 30).map(({ n, key, draft }) => {
              const t = getDocTime(n);
              const isToday = t ? istDateKey(new Date(t)) === todayKey : false;

              return (
                <div
                  key={key}
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Book className="h-5 w-5 text-slate-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected.has(key)}
                          onChange={() => toggle(key)}
                          className="mt-0.5"
                        />

                        <a
                          href={n.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-indigo-700 hover:underline line-clamp-2"
                        >
                          {n.title}
                        </a>

                        {isToday && (
                          <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                            Today
                          </span>
                        )}
                      </div>

                      {n.summary ? (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {n.summary}
                        </p>
                      ) : null}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[11px] text-slate-500">
                          {n.sourceCode ? (
                            <span className="font-mono">{n.sourceCode}</span>
                          ) : null}
                          {t ? (
                            <span className="ml-2">
                              {new Date(t).toLocaleString("en-IN")}
                            </span>
                          ) : null}
                        </div>

                        {/* <button
                          onClick={() => uploadOne(draft)}
                          disabled={uploading}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-60"
                        >
                          Upload one
                        </button> */}
                      </div>

                      <details className="mt-2">
                        <summary className="cursor-pointer text-[11px] text-slate-600">
                          View draft payload
                        </summary>
                        <pre className="mt-2 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-700">
                          {JSON.stringify(draft, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {enriched.length > 30 && (
          <p className="mt-3 text-xs text-slate-500">
            Showing 30 of {enriched.length}. (Add pagination if needed.)
          </p>
        )}
      </div>

      {/* ===================== DRAFTS MODAL ===================== */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeDraftModal}
          />

          <div className="absolute left-1/2 top-1/2 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  Draft Payloads
                </div>
                <div className="text-[11px] text-slate-500">
                  Mode: <span className="font-mono">{draftMode}</span> • Count:{" "}
                  <span className="font-semibold">{modalDrafts.length}</span>
                </div>
              </div>

              <button
                onClick={closeDraftModal}
                className="rounded-md border border-slate-300 p-2 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="inline-flex rounded-md border border-slate-300 overflow-hidden">
                <button
                  onClick={() => setDraftMode("selected")}
                  className={`px-3 py-2 text-xs ${
                    draftMode === "selected"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-white text-slate-700"
                  }`}
                >
                  Selected ({draftsSelected.length})
                </button>
                <button
                  onClick={() => setDraftMode("all")}
                  className={`px-3 py-2 text-xs border-l border-slate-300 ${
                    draftMode === "all"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-white text-slate-700"
                  }`}
                >
                  All ({draftsAll.length})
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={modalDrafts.length === 0}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50 disabled:opacity-60"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy JSON"}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={modalDrafts.length === 0}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50 disabled:opacity-60"
                >
                  <Download className="h-4 w-4" />
                  Download JSON
                </button>

                {/* ✅ changed: open edit modal instead of uploading */}
                <button
                  onClick={() => openEditModal(modalDrafts)}
                  disabled={modalDrafts.length === 0}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  <Pencil className="h-4 w-4" />
                  Edit then Upload
                </button>
              </div>
            </div>

            <div className="max-h-[65vh] overflow-auto px-4 pb-4">
              {modalDrafts.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  No drafts to show in{" "}
                  <span className="font-mono">{draftMode}</span> mode.
                </div>
              ) : (
                <pre className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-800 overflow-auto">
                  {modalJson}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                onClick={closeDraftModal}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT & UPLOAD MODAL ===================== */}
      {editModalOpen && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeEditModal}
          />

          <div className="absolute left-1/2 top-1/2 w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeEditModal}
                  className="rounded-md border border-slate-300 p-2 hover:bg-slate-50"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Edit & Upload
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Edit fields → Final Upload • Count:{" "}
                    <span className="font-semibold">{editDrafts.length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-md border border-slate-300 p-2 hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* error */}
            {editError ? (
              <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
                {editError}
              </div>
            ) : null}

            {/* body */}
            <div className="max-h-[65vh] overflow-auto px-4 py-4">
              {editDrafts.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                  No drafts to edit.
                </div>
              ) : (
                <div className="space-y-3">
                  {editDrafts.map((d, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <div>
                              <label className="text-[11px] text-slate-600">
                                Title
                              </label>
                              <input
                                value={d.title ?? ""}
                                onChange={(e) =>
                                  updateDraftField(idx, "title", e.target.value)
                                }
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="Result title"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-600">
                                Link
                              </label>
                              <input
                                value={d.link ?? ""}
                                onChange={(e) =>
                                  updateDraftField(idx, "link", e.target.value)
                                }
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                placeholder="https://..."
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-600">
                                Result Date (optional)
                              </label>
                              <input
                                type="date"
                                value={d.resultDate ?? ""}
                                onChange={(e) =>
                                  updateDraftField(
                                    idx,
                                    "resultDate",
                                    e.target.value || null
                                  )
                                }
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                              />
                              <div className="mt-1 text-[11px] text-slate-500">
                                Leave empty if unknown.
                              </div>
                            </div>

                            <div className="flex items-end gap-2">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={!!d.isTentative}
                                  onChange={(e) =>
                                    updateDraftField(
                                      idx,
                                      "isTentative",
                                      e.target.checked
                                    )
                                  }
                                />
                                <span className="text-[13px] text-slate-700">
                                  Tentative
                                </span>
                              </label>
                            </div>

                            <div className="md:col-span-2">
                              <label className="text-[11px] text-slate-600">
                                Description (optional)
                              </label>
                              <textarea
                                value={d.description ?? ""}
                                onChange={(e) =>
                                  updateDraftField(
                                    idx,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                rows={2}
                                placeholder="Any notes you want to store..."
                              />
                            </div>
                          </div>

                          <details className="mt-2">
                            <summary className="cursor-pointer text-[11px] text-slate-600">
                              View row JSON
                            </summary>
                            <pre className="mt-2 overflow-auto rounded-md bg-slate-50 p-2 text-[11px] text-slate-700">
                              {JSON.stringify(d, null, 2)}
                            </pre>
                          </details>
                        </div>

                        <button
                          onClick={() => removeDraft(idx)}
                          className="shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                          title="Remove this draft"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-4 py-3">
              <button
                onClick={() =>
                  downloadJson("edited-result-drafts.json", editDrafts)
                }
                disabled={editDrafts.length === 0}
                className="rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50 disabled:opacity-60"
              >
                Download Edited JSON
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={closeEditModal}
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={finalUploadEdited}
                  disabled={uploading || editDrafts.length === 0}
                  className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  <UploadCloud className="h-4 w-4" />
                  Final Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
