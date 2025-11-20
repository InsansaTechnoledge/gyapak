import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const DetailsSection = ({ setEventData, eventData }) => {
  /* ====================== helpers ====================== */
  const isIsoDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
  const isDMYdot = (s) => typeof s === "string" && /^\d{2}\.\d{2}\.\d{4}$/.test(s);
  const isDMYdash = (s) => typeof s === "string" && /^\d{2}-\d{2}-\d{4}$/.test(s);

  const toISO = (s) => {
    if (isIsoDate(s)) return s;
    if (isDMYdot(s) || isDMYdash(s)) {
      const sep = s.includes(".") ? "." : "-";
      const [dd, mm, yyyy] = s.split(sep);
      return `${yyyy}-${mm}-${dd}`;
    }
    return s;
  };

  function detectType(value) {
    if (Array.isArray(value)) return "array";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "string" && isIsoDate(value)) return "date";
    return "string";
  }

  function coerceValue(v) {
    if (typeof v === "string") {
      if (v === "true") return true;
      if (v === "false") return false;
      return toISO(v); // normalize date-like strings
    }
    return v;
  }

  // Flatten nested objects to dot.notation
  function flatten(obj, prefix = "", out = {}) {
    if (obj == null) return out;
    if (Array.isArray(obj)) {
      out[prefix || ""] = obj.map(coerceValue);
      return out;
    }
    if (typeof obj === "object") {
      Object.entries(obj).forEach(([k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
          flatten(v, key, out);
        } else if (Array.isArray(v)) {
          out[key] = v.map(coerceValue);
        } else {
          out[key] = coerceValue(v);
        }
      });
      return out;
    }
    out[prefix || ""] = coerceValue(obj);
    return out;
  }

  function objectToEntries(obj) {
    if (!obj || typeof obj !== "object") return [];
    return Object.entries(obj).map(([left, right]) => {
      const val = Array.isArray(right) ? right.map(coerceValue) : [coerceValue(right)];
      const type = detectType(Array.isArray(right) ? right : val[0]);
      return { id: uuidv4(), left, right: val, type };
    });
  }

  const entriesToObject = (rows) =>
    rows.reduce((acc, { left, right }) => {
      if (left) acc[left] = right.length === 1 ? right[0] : right;
      return acc;
    }, {});

  /* ====================== state ====================== */
  const [entries, setEntries] = useState(objectToEntries(eventData?.details) || []);
  const [uploadedItems, setUploadedItems] = useState([]); // items[] from uploaded JSON
  const [selectedIdx, setSelectedIdx] = useState(""); // index string into uploadedItems
  const [mergeMode, setMergeMode] = useState(false);

  /* ====================== sync to parent ====================== */
  useEffect(() => {
    setEventData((prev) => ({
      ...prev,
      details: entriesToObject(entries),
    }));
  }, [entries, setEventData]);

  /* ====================== mutations ====================== */
  const addEntry = () =>
    setEntries((r) => [...r, { id: uuidv4(), left: "", right: [""], type: "string" }]);

  const deleteEntry = (id) => setEntries((r) => r.filter((x) => x.id !== id));

  const handleTypeChange = (id, newType) => {
    setEntries((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        let nextRight = row.right;

        // coerce shape to match type
        if (newType === "string") {
          nextRight = [String(row.right?.[0] ?? "")];
        } else if (newType === "date") {
          const v = row.right?.[0] ?? "";
          nextRight = [typeof v === "string" ? toISO(v) : ""];
        } else if (newType === "boolean") {
          const v = row.right?.[0];
          nextRight = [Boolean(v)];
        } else if (newType === "array") {
          nextRight = Array.isArray(row.right) ? row.right : [String(row.right?.[0] ?? "")];
        }
        return { ...row, type: newType, right: nextRight };
      })
    );
  };

  const handleChange = (id, field, value) => {
    if (field === "type") return handleTypeChange(id, value);
    setEntries((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const addArrayItem = (id) =>
    setEntries((r) => r.map((x) => (x.id === id ? { ...x, right: [...x.right, ""] } : x)));

  const updateArrayItem = (id, index, value) =>
    setEntries((r) =>
      r.map((x) => {
        if (x.id !== id) return x;
        const right = [...x.right];
        right[index] = value;
        return { ...x, right };
      })
    );

  const removeArrayItem = (id, index) =>
    setEntries((r) =>
      r.map((x) => {
        if (x.id !== id) return x;
        return { ...x, right: x.right.filter((_, i) => i !== index) };
      })
    );

  // ---- object item editing inside arrays ----
  const updateArrayObjectKey = (id, index, objKey, value) => {
    setEntries((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = [...row.right];
        const cur = next[index] && typeof next[index] === "object" ? { ...next[index] } : {};
        cur[objKey] = value;
        next[index] = cur;
        return { ...row, right: next };
      })
    );
  };

  const addKeyToArrayObject = (id, index) => {
    setEntries((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = [...row.right];
        const cur = next[index] && typeof next[index] === "object" ? { ...next[index] } : {};
        let k = "key";
        let i = 1;
        while (Object.prototype.hasOwnProperty.call(cur, k)) k = `key_${i++}`;
        cur[k] = "";
        next[index] = cur;
        return { ...row, right: next };
      })
    );
  };

  const removeKeyFromArrayObject = (id, index, objKey) => {
    setEntries((rows) =>
      rows.map((row) => {
        if (row.id !== id) return row;
        const next = [...row.right];
        const cur = { ...(next[index] || {}) };
        delete cur[objKey];
        next[index] = cur;
        return { ...row, right: next };
      })
    );
  };

  /* ====================== upload & select ====================== */
  // Accepts JSON whose root has { items: [...] }
  const handleJsonFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      if (!items.length) {
        alert("Uploaded JSON has no 'items' array.");
        return;
      }
      setUploadedItems(items);
      setSelectedIdx("");
    } catch (err) {
      console.error("Invalid JSON file:", err);
      alert("Could not parse JSON. Please upload a valid .json file.");
    } finally {
      e.target.value = "";
    }
  };

  const handleSelectItem = (idxStr) => {
    setSelectedIdx(idxStr);
    const idx = idxStr === "" ? -1 : Number(idxStr);
    if (idx < 0 || !uploadedItems[idx]) return;

    const selected = uploadedItems[idx];
    const flat = flatten(selected);
    if (mergeMode) {
      // merge with existing (user's current keys win)
      const existing = entriesToObject(entries);
      const merged = { ...flat, ...existing };
      setEntries(objectToEntries(merged));
    } else {
      // replace
      setEntries(objectToEntries(flat));
    }
  };

  /* ====================== render ====================== */
  return (
    <div className="space-y-4">
      {/* Upload + selector */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          accept="application/json"
          onChange={handleJsonFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-600 file:text-white file:cursor-pointer border-2 border-purple-700 rounded-md p-1"
        />

        <select
          className="border-2 border-purple-700 rounded-md p-2 min-w-[280px]"
          value={selectedIdx}
          onChange={(e) => handleSelectItem(e.target.value)}
          disabled={!uploadedItems.length}
          title={uploadedItems.length ? "Choose an entry from uploaded items" : "Upload JSON first"}
        >
          <option value="">
            {uploadedItems.length ? "Select an entry…" : "Upload JSON to load items"}
          </option>
          {uploadedItems.map((it, i) => (
            <option key={i} value={i}>
              {`${it?.title || it?.job?.post_name || "Untitled"} — ${it?.organization || ""}`}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={mergeMode}
            onChange={(e) => setMergeMode(e.target.checked)}
          />
          Merge into existing (don’t overwrite current keys)
        </label>
      </div>

      {/* Rows */}
      {entries.map(({ id, left, right, type }) => (
        <div key={id} className="grid grid-cols-5 gap-5">
          {/* Left key */}
          <input
            type="text"
            placeholder="Key (Left)"
            value={left}
            onChange={(e) => handleChange(id, "left", e.target.value)}
            className="col-span-1 border-2 border-purple-700 rounded-md p-1"
          />

          {/* Right value(s) */}
          {type === "string" && (
            <input
              type="text"
              placeholder="Value (Right)"
              value={right[0] ?? ""}
              onChange={(e) => updateArrayItem(id, 0, e.target.value)}
              className="col-span-2 border-2 border-purple-700 rounded-md p-1"
            />
          )}

          {type === "date" && (
            <input
              type="date"
              value={right[0] ?? ""}
              onChange={(e) => updateArrayItem(id, 0, e.target.value)}
              className="col-span-2 border-2 border-purple-700 rounded-md p-1"
            />
          )}

          {type === "boolean" && (
            <select
              value={String(right[0] ?? false)}
              onChange={(e) => updateArrayItem(id, 0, e.target.value === "true")}
              className="col-span-2 border-2 border-purple-700 rounded-md p-1"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}

          {type === "array" && (
            <div className="col-span-2">
              {right.map((item, index) => {
                const isObj = item && typeof item === "object" && !Array.isArray(item);
                if (isObj) {
                  const keys = Object.keys(item);
                  return (
                    <div key={index} className="mb-3 rounded-md border border-purple-300 p-2 space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-sm">Object #{index + 1}</strong>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => addKeyToArrayObject(id, index)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            + key
                          </button>
                          <button
                            type="button"
                            onClick={() => removeArrayItem(id, index)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Remove object
                          </button>
                        </div>
                      </div>

                      {keys.length === 0 && (
                        <div className="text-xs text-gray-500">Empty object — add keys.</div>
                      )}

                      {keys.map((k) => (
                        <div key={k} className="grid grid-cols-5 gap-2">
                          <input
                            type="text"
                            readOnly
                            value={k}
                            className="col-span-2 border-2 border-purple-700 rounded-md p-1 bg-gray-50"
                          />
                          <input
                            type="text"
                            value={String(item[k] ?? "")}
                            onChange={(e) => updateArrayObjectKey(id, index, k, e.target.value)}
                            className="col-span-2 border-2 border-purple-700 rounded-md p-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeKeyFromArrayObject(id, index, k)}
                            className="bg-red-500 text-white px-2 py-1 rounded-md"
                          >
                            −
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                }

                // primitive item
                return (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item ?? ""}
                      onChange={(e) => updateArrayItem(id, index, e.target.value)}
                      className="border-2 border-purple-700 rounded-md p-1 w-full"
                    />
                    <button
                      onClick={() => removeArrayItem(id, index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => addArrayItem(id)}
                className="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Add Item
              </button>
            </div>
          )}

          {/* Type selector */}
          <select
            value={type}
            onChange={(e) => handleChange(id, "type", e.target.value)}
            className="border-2 border-purple-700 rounded-md p-1"
          >
            <option value="string">String</option>
            <option value="date">Date</option>
            <option value="boolean">Boolean</option>
            <option value="array">Array</option>
          </select>

          <button
            onClick={() => deleteEntry(id)}
            className="bg-purple-600 text-white text-lg px-5 py-2 rounded-md"
          >
            Delete Entry
          </button>
        </div>
      ))}

      <button onClick={addEntry} className="bg-purple-600 text-white text-lg px-5 py-2 rounded-md">
        Add Entry
      </button>
    </div>
  );
};

export default DetailsSection;
