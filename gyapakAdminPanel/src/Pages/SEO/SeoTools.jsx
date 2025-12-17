import React, { useEffect, useMemo, useState } from "react";
import SeoIntro from "./Components/SeoIntro";
import SeoPerformance from "./Components/SeoPerformance";
import GSCQueriesPage from "./Components/GSCQueriesPage";
import GSCPagesPage from "./Components/GSCPagesPage";
import GSCToolsPage from "./Components/GSCToolsPage";
import IndexingApiPage from "./Components/IndexingApiPage";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adminpanel.gyapak.in/api"; 
const LS_ACCESS_KEY = "gyapak_seo_access_v1";

const readAccessLevel = () => {
    try{        
        const v = localStorage.getItem(LS_ACCESS_KEY);
        return v === 'full' || v === 'restricted' ? v: 'none'
    } catch {
        return "none";
    }
}

const writeAccessLevel = (level) => {
    localStorage.setItem(LS_ACCESS_KEY, level);
}

const clearAccessLevel = () => {
    localStorage.removeItem(LS_ACCESS_KEY);
}

const SeoTools = () => {
  const [accessLevel, setAccessLevel] = useState(() => readAccessLevel());

  const [accessCredentials, setAccessCredentials] = useState({ id: "", password: "" });

  const fullAccessId = import.meta.env.VITE_FULL_ACCESS_ID;
  const fullAccessPassword = import.meta.env.VITE_FULL_ACCESS_PASSWORD;

  const restrictedAccessId = import.meta.env.VITE_RESTRICTED_ACCESS_ID;
  const restrictedAccessPassword = import.meta.env.VITE_RESTRICTED_ACCESS_PASSWORD;

  const canSubmit = useMemo(() => {
    return accessCredentials.id.trim() && accessCredentials.password.trim();
  }, [accessCredentials]);

  useEffect(() => {
    writeAccessLevel(accessLevel);
  },[accessLevel]);

  const handleAccessSubmit = (e) => {
    e?.preventDefault?.();

    const id = accessCredentials.id.trim();
    const pw = accessCredentials.password.trim();

    if (id === fullAccessId && pw === fullAccessPassword) {
      setAccessLevel("full");
      writeAccessLevel("full");
      return;
    }

    if (id === restrictedAccessId && pw === restrictedAccessPassword) {
      setAccessLevel("restricted");
      writeAccessLevel("restricted");
      return;
    }

    alert("Invalid credentials");
    setAccessLevel("none");
  };

  const handleLogout = () => {
    setAccessLevel("none");
    setAccessCredentials({ id: "", password: "" });
    clearAccessLevel();
  };

  return (
    <div className="mt-20 p-4 min-h-screen">
      <h1 className="text-4xl text-center font-semibold mt-5 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800">
        Gyapak SEO tools
      </h1>

      <SeoIntro />

     
      <div className="max-w-xl mx-auto mt-8 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Access</h2>
            <p className="text-xs text-gray-500 mt-1">
              Current access:{" "}
              <span className="font-semibold text-purple-700">
                {accessLevel === "none" ? "No access" : accessLevel === "restricted" ? "Restricted" : "Full"}
              </span>
            </p>
          </div>

          {accessLevel !== "none" && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Logout
            </button>
          )}
        </div>

        {accessLevel === "none" && (
          <form onSubmit={handleAccessSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                ID
              </label>
              <input
                value={accessCredentials.id}
                onChange={(e) => setAccessCredentials((p) => ({ ...p, id: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                placeholder="Enter ID"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={accessCredentials.password}
                onChange={(e) => setAccessCredentials((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-purple-200 bg-white text-sm text-gray-800
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                placeholder="Enter password"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium
                           hover:bg-purple-700 disabled:opacity-60"
              >
                Unlock Tools
              </button>
              
            </div>
          </form>
        )}
      </div>

      
      {accessLevel === "full" && (
        <>
          <GSCToolsPage url={API_BASE_URL}/>
          <IndexingApiPage />
          <SeoPerformance url={API_BASE_URL} />
          <GSCQueriesPage url={API_BASE_URL} />
          <GSCPagesPage url={API_BASE_URL} />
        </>
      )}

      {accessLevel === "restricted" && (
        <>
          <div className="max-w-5xl mx-auto mt-8 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-700">
              Restricted mode: only Indexing API is available.
            </div>
          </div>
          <IndexingApiPage />
        </>
      )}
    </div>
  );
};

export default SeoTools;
