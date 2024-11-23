import { useState, useEffect, createContext } from "react";
import { getTheme, updateTheme } from "../api/users";
import * as authAPI from "../api/authAPI";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import cookie from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const authenticateUser = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const loginUser = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      if (data) {
        authenticateUser(data);
        const theme = await getTheme(data.id);
        window.localStorage.setItem("theme", theme.darkMode);
        toast.success("¡Bienvenido!");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      console.error("Error during login", error);
    }
  };

  const logoutUser = async () => {
    try {
      await authAPI.logout();
      cookie.remove("token");
      setCurrentUser(null);
      setIsAuthenticated(false);
      window.localStorage.removeItem("theme");
      toast.success("¡Hasta pronto!");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      toast.error("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  const updateThemeUser = async (theme) => {
    if (!currentUser || !currentUser.userId) return;
    try {
      await updateTheme(currentUser.userId, theme);
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      console.error(`Error al actualizar el tema: ${error.message}`);
      toast.error("Error al actualizar el tema");
    }
  };

  useEffect(() => {
    async function checkLoginStatus() {
      const cookies = cookie.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setCurrentUser(null);
      }

      try {
        const res = await authAPI.verifyToken(cookies.token);
        if (!res.success) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setCurrentUser(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoading(false);
      }
    }

    checkLoginStatus();
  }, []);

  const value = {
    currentUser,
    setCurrentUser: authenticateUser,
    loginUser,
    logoutUser,
    isAuthenticated,
    updateThemeUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};