import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { applyThemeVars } from "./applyTheme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ apiBaseUrl, children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadActiveTheme = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/theme/active`);
      const t = res?.data?.theme;
      if (t?.vars) applyThemeVars(t.vars);
      setTheme(t || null);
    } catch (e) {
      // fallback: your CSS :root defaults will apply
    //   console.log("theme load failed:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveTheme();
  }, [apiBaseUrl]);

  return (
    <ThemeContext.Provider value={{ theme, loading, reloadTheme: loadActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
