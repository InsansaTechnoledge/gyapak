// src/pages/TrackNewUpdates.jsx (or wherever you keep it)
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import ManageSources from "./ManageSources";
import { API_BASE_URL } from "../config";

const API_BASE = API_BASE_URL;
// const API_BASE = "http://localhost:3000";


const socket = io(API_BASE, {
  withCredentials: true,
  transports: ["websocket"],
});

const TrackNewUpdates = () => {
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loadingSources, setLoadingSources] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // 1️⃣ Load all sources (your 15 links)
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/sources`, {
          withCredentials: true,
        });
        const data = res?.data?.data || [];
        setSources(data);

        // auto-select first source if you want
        if (data.length && !selectedSource) {
          setSelectedSource(data[0].code);
        }
      } catch (err) {
        console.error("Error fetching sources:", err);
      } finally {
        setLoadingSources(false);
      }
    };

    fetchSources();
  }, []);

  // 2️⃣ Load notifications whenever selected source changes
  useEffect(() => {
    if (!selectedSource) return;

    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const res = await axios.get(`${API_BASE}/api/notifications`, {
          params: { sourceCode: selectedSource, limit: 50 },
          withCredentials: true,
        });
        setNotifications(res?.data?.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [selectedSource]);

  // 3️⃣ Socket.IO – subscribe to live updates for selected source
  useEffect(() => {
    if (!selectedSource) return;

    // join that source room
    socket.emit("subscribe-source", selectedSource);

    const handleNewNotifications = (newDocs) => {
      // backend emits only docs for that room, so safe to prepend
      setNotifications((prev) => [...newDocs, ...prev]);
    };

    socket.on("new-notifications", handleNewNotifications);

    // cleanup when source changes/unmounts
    return () => {
      socket.off("new-notifications", handleNewNotifications);
      // optional: you can emit a custom leave event if you implement it server-side
      // socket.emit("unsubscribe-source", selectedSource);
    };
  }, [selectedSource]);

  return (
    <div className="mt-30 max-w-7xl mx-auto px-4 py-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <ManageSources/>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Track New Updates
          </h1>
          <p className="text-sm text-slate-500">
            Live government job / notification feed from your monitored sites.
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          <span className="text-xs font-medium text-green-700">LIVE</span>
        </div>
      </div>

      {/* Source selector */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700">
          Select Source
        </label>

        {loadingSources ? (
          <span className="text-xs text-slate-500">Loading sources…</span>
        ) : (
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Choose a source --</option>
            {sources.map((s) => (
              <option key={s._id} value={s.code}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Notifications list */}
      <div className="mt-4">
        {loadingNotifications && (
          <p className="text-sm text-slate-500 mb-2">Loading notifications…</p>
        )}

        {!loadingNotifications && notifications.length === 0 && (
          <p className="text-sm text-slate-500">
            No notifications found yet for this source.
          </p>
        )}

        <ul className="divide-y divide-slate-200">
          {notifications.map((n) => (
            <li key={n._id} className="py-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    {n.title}
                  </a>
                  {n.summary && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {n.summary}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">
                    {n.firstSeenAt || n.publishedAt
                      ? new Date(
                          n.firstSeenAt || n.publishedAt
                        ).toLocaleString()
                      : ""}
                  </p>
                  <span className="inline-flex mt-1 items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {n.sourceCode}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrackNewUpdates;
