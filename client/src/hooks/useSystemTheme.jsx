import { useState, useEffect } from 'react';

const useSystemTheme = () => {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', updateTheme);

    updateTheme();

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return theme;
};

export default useSystemTheme;