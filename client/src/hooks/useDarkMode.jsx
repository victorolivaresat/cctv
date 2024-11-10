import { useState, useEffect } from "react";
import useSystemTheme  from "./useSystemTheme";


const useDarkMode = () => {
  const localStorageTheme = window.localStorage.getItem("theme");
  const isLocalStorageDark = localStorageTheme === "true";
  const [darkMode, setDarkMode] = useState(isLocalStorageDark);
  const systemTheme = useSystemTheme();

  useEffect(() => {
    if (localStorageTheme === null && systemTheme !== null) {
      setDarkMode(systemTheme);
    } else if (isLocalStorageDark !== darkMode) {
      setDarkMode(isLocalStorageDark);
    }
  }, [isLocalStorageDark, darkMode, systemTheme, localStorageTheme]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;
