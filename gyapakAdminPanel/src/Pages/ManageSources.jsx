import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const initialForm = {
  code: "",
  name: "",
  baseUrl: "",
  notificationUrl: "",
  type: "html",
  selector: "",
  intervalMinutes: 5,
};

const ManageSources = () => {
  const [sources, setSources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Load all sources
  const fetchSources = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/sources`, {
        withCredentials: true,
      });
      setSources(res?.data?.data || []);
    } catch (err) {
      console.error("Error loading sources", err);
      setError("Failed to load sources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "intervalMinutes"
          ? Number(value || 0)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (editingId) {
        // Update
        await axios.put(`${API_BASE}/api/sources/${editingId}`, form, {
          withCredentials: true,
        });
      } else {
        // Create
        await axios.post(`${API_BASE}/api/sources`, form, {
          withCredentials: true,
        });
      }

      await fetchSources();
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      console.error("Error saving source", err);
      setError(
        err?.response?.data?.message || "Failed to save source"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (source) => {
    setEditingId(source._id);
    setForm({
      code: source.code,
      name: source.name,
      baseUrl: source.baseUrl,
      notificationUrl: source.notificationUrl,
      type: source.type,
      selector: source.selector || "",
      intervalMinutes: source.intervalMinutes || 5,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this source?")) return;
    try {
      await axios.delete(`${API_BASE}/api/sources/${id}`, {
        withCredentials: true,
      });
      await fetchSources();
    } catch (err) {
      console.error("Error deleting source", err);
      setError("Failed to delete source");
    }
  };

  const handleToggleActive = async (source) => {
    try {
      await axios.put(
        `${API_BASE}/api/sources/${source._id}`,
        { isActive: !source.isActive },
        { withCredentials: true }
      );
      await fetchSources();
    } catch (err) {
      console.error("Error toggling active", err);
      setError("Failed to update active status");
    }
  };

  return (
    <div className=" mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">
        Manage Sources 
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 md:grid-cols-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
      >
        <div className="md:col-span-2">
          <h2 className="text-lg font-medium">
            {editingId ? "Edit Source" : "Add New Source"}
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Code (unique)
          </label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            placeholder="CENTRAL_UPSC"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            placeholder="UPSC"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Base URL
          </label>
          <input
            name="baseUrl"
            value={form.baseUrl}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            placeholder="https://www.upsc.gov.in"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notification URL
          </label>
          <input
            name="notificationUrl"
            value={form.notificationUrl}
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            placeholder="https://www.upsc.gov.in/recruitment/recruitment-advertisement"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          >
            <option value="html">HTML</option>
            <option value="rss">RSS</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Interval (minutes)
          </label>
          <input
            name="intervalMinutes"
            type="number"
            min={1}
            value={form.intervalMinutes}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            CSS Selector (for HTML type)
          </label>
          <input
            name="selector"
            value={form.selector}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            placeholder=".notice-list a  or  #content table a"
          />
          <p className="text-xs text-slate-500 mt-1">
            Leave empty to scan all links under &lt;body&gt; (not recommended for complex pages).
          </p>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? editingId
                ? "Updating..."
                : "Saving..."
              : editingId
              ? "Update Source"
              : "Add Source"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-sm rounded-md border border-slate-300 text-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Sources table */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">All Sources</h2>
          {loading && <span className="text-xs text-slate-500">Loading…</span>}
        </div>

        {sources.length === 0 && !loading && (
          <p className="text-sm text-slate-500">
            No sources yet. Add one using the form above.
          </p>
        )}

        {sources.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-2 py-2 text-left">Code</th>
                  <th className="px-2 py-2 text-left">Name</th>
                  <th className="px-2 py-2 text-left">Type</th>
                  <th className="px-2 py-2 text-left">Interval</th>
                  <th className="px-2 py-2 text-left">Active</th>
                  <th className="px-2 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100">
                    <td className="px-2 py-2 font-mono">{s.code}</td>
                    <td className="px-2 py-2">{s.name}</td>
                    <td className="px-2 py-2">{s.type}</td>
                    <td className="px-2 py-2">{s.intervalMinutes} min</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => handleToggleActive(s)}
                        className={`px-2 py-0.5 rounded-full text-[11px] ${
                          s.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-xs px-2 py-1 rounded-md border border-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-xs px-2 py-1 rounded-md border border-red-300 text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSources;
