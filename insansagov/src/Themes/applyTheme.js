// src/theme/applyTheme.js
export const applyThemeVars = (vars = {}) => {
    const root = document.documentElement; // :root
    Object.entries(vars || {}).forEach(([key, value]) => {
      if (key.startsWith("--") && typeof value === "string") {
        root.style.setProperty(key, value.trim());
      }
    });
  };
  