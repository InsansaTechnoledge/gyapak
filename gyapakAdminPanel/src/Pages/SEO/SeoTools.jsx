import React, { useEffect, useMemo, useState } from "react";
import SeoIntro from "./Components/SeoIntro";
import SeoPerformance from "./Components/SeoPerformance";
import GSCQueriesPage from "./Components/GSCQueriesPage";
import GSCPagesPage from "./Components/GSCPagesPage";
import GSCToolsPage from "./Components/GSCToolsPage";
import IndexingApiPage from "./Components/IndexingApiPage";
import { useAuth } from "../../Components/Auth/AuthContext";

const SeoTools = () => {
  const { user, isAuthenticated } = useAuth();

  // Determine access level based on user role
  // admin = full access
  // data entry = restricted access (indexing only)
  const accessLevel = useMemo(() => {
    if (!isAuthenticated || !user) {
      return "none";
    }
    
    if (user.role === "admin") {
      return "full";
    }
    
    if (user.role === "data entry") {
      return "restricted";
    }
    
    return "none";
  }, [isAuthenticated, user]);

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
                {accessLevel === "none"
                  ? "No access"
                  : accessLevel === "restricted"
                  ? "Restricted (Indexing Only)"
                  : "Full Access"}
              </span>
            </p>
            {user && (
              <p className="text-xs text-gray-500 mt-1">
                Logged in as:{" "}
                <span className="font-semibold text-purple-700">
                  {user.name} ({user.role})
                </span>
              </p>
            )}
          </div>
        </div>

        {accessLevel === "none" && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              You need to be logged in with appropriate permissions to access SEO tools.
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              • <strong>Admin</strong>: Full access to all SEO tools
              <br />
              • <strong>Data Entry</strong>: Access to Indexing API only
            </p>
          </div>
        )}
      </div>

      {accessLevel === "full" && (
        <>
          <GSCToolsPage />
          <IndexingApiPage />
          <SeoPerformance />
          <GSCQueriesPage />
          <GSCPagesPage />
        </>
      )}

      {accessLevel === "restricted" && (
        <>
          <div className="max-w-5xl mx-auto mt-8 rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-gray-700">
              <strong>Restricted Access:</strong> As a Data Entry user, you have access to the Indexing API only.
              <br />
              <span className="text-xs text-gray-500 mt-1">
                Contact an administrator for full access to all SEO tools.
              </span>
            </div>
          </div>
          <IndexingApiPage />
        </>
      )}
    </div>
  );
};

export default SeoTools;
