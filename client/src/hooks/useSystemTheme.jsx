import { useEffect, useState } from 'react';

const useSystemTheme = () => {

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      // Convertir 'dark' o 'light' a valor booleano
      setTheme(mediaQuery.matches ? true : false);
    };

    // Agregar listener para cambios de preferencia de color del sistema
    mediaQuery.addEventListener('change', updateTheme);

    // Actualizar el tema al cargar la página
    updateTheme();

    // Limpiar el listener al desmontar el componente
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  return theme;
  
};

export default useSystemTheme;
