import { useState, useEffect } from "react";
import useSystemTheme from "./useSystemTheme";

const useDarkMode = () => {
  const systemTheme = useSystemTheme();
  const [darkMode, setDarkMode] = useState(systemTheme === "dark");

  useEffect(() => {
    setDarkMode(systemTheme === "dark");
  }, [systemTheme]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;