// src/Hooks/useEventRouting.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCachedEventUrl, resolveEventUrl } from "./eventRouting.service";
import { useApi } from "../Context/ApiContext";

export const useEventRouting = ({ fallback = "old" } = {}) => {
  const { apiBaseUrl } = useApi();
  const navigate = useNavigate();

  // Use this in <Link to={...}> so copy/open-in-new-tab works without waiting.
  const getEventHref = useCallback(
    (event) => {
      const id = event?._id;
      const name = event?.name;
      return getCachedEventUrl(name, id, fallback);
    },
    [fallback]
    
  );
  

  // Use this onClick to always go to the correct url after checking backend.
  const handleEventClick = useCallback(
    async (e, event) => {
      e?.preventDefault?.();

      const id = event?._id;
      const name = event?.name;
      if (!id || !name) return;

      const url = await resolveEventUrl(apiBaseUrl, { id, name }, fallback);
      if (url) navigate(url);
    },
    [apiBaseUrl, navigate, fallback]
  );

  // Programmatic navigation (buttons etc.)
  const navigateToEvent = useCallback(
    async (event) => {
      const id = event?._id;
      const name = event?.name;
      if (!id || !name) return;

      const url = await resolveEventUrl(apiBaseUrl, { id, name }, fallback);
      if (url) navigate(url);
    },
    [apiBaseUrl, navigate, fallback]
  );

  // Optional: warm up cache on hover
  const prefetchEventRoute = useCallback(
    async (event) => {
      const id = event?._id;
      const name = event?.name;
      if (!id || !name) return;
      await resolveEventUrl(apiBaseUrl, { id, name }, fallback);
    },
    [apiBaseUrl, fallback]
  );

  return { getEventHref, handleEventClick, navigateToEvent, prefetchEventRoute };
};
