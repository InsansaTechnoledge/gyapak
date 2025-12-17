// src/Service/eventRouting.service.js
import axios from "axios";
import slugGenerator from "./SlugGenerator";
import { generateSlugUrl } from "./urlUtils.utils";


const routeCache = new Map(); // id -> { url, ts }
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const buildOldEventUrl = (name, id) =>
  `/top-exams-for-government-jobs-in-india/${slugGenerator(name)}?id=${id}`;

export const buildNewEventUrl = (name, id) => generateSlugUrl(name, id);

export const getCachedEventUrl = (name, id, fallback = "old") => {
  if (!id || !name) return "#";

  const cached = routeCache.get(id);
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.url;

  // when not cached, return a safe default (so right-click open works)
  return fallback === "new" ? buildNewEventUrl(name, id) : buildOldEventUrl(name, id);
};

export const resolveEventUrl = async (apiBaseUrl, { id, name }, fallback = "old") => {
  if (!apiBaseUrl || !id || !name) return null;

  // cache first
  const cached = routeCache.get(id);
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.url;

  try {
    // ✅ your backend endpoint
    const { data } = await axios.get(`${apiBaseUrl}/api/event/isNew/${id}`, {
      withCredentials: true,
    });

    const isNew = data?.isNewEvent;

    const url =
      isNew === true
        ? buildNewEventUrl(name, id)
        : isNew === false
        ? buildOldEventUrl(name, id)
        : fallback === "new"
        ? buildNewEventUrl(name, id)
        : buildOldEventUrl(name, id);

    routeCache.set(id, { url, ts: Date.now() });
    return url;
  } catch (err) {
    // fallback if API fails
    const url = fallback === "new" ? buildNewEventUrl(name, id) : buildOldEventUrl(name, id);
    routeCache.set(id, { url, ts: Date.now() });
    return url;
  }
};

export const clearEventRouteCache = (id) => {
  if (!id) return routeCache.clear();
  routeCache.delete(id);
};
