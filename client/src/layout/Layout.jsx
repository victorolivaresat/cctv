import DarkModeContext from "../contexts/DarkModeContext";
import { useAuth } from "../contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import AppRoutes from "../routes/Routes";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const URL_IMAGE_DARK = "url('../src/assets/img/login_dark.svg')";
const URL_IMAGE_LIGHT = "url('../src/assets/img/login.svg')";

const Layout = () => {
  const [show, setShow] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const { updateThemeUser } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleShow = (value) => setShow(value);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;

    try {
      await updateThemeUser(newMode);
      setDarkMode(newMode);
      console.log("Tema actualizado correctamente", newMode);
    } catch (error) {
      console.error("Error al actualizar el tema:", error);
    }
  };

  const updateBackground = () => {
    const root = document.getElementById('root');
    if (isLoginPage) {
      root.style.backgroundImage = darkMode ? URL_IMAGE_DARK : URL_IMAGE_LIGHT;
      root.style.backgroundSize = 'cover';
      root.style.backgroundRepeat = 'no-repeat';
    } else {
      root.style.backgroundImage = 'none';
    }
  };

  useEffect(updateBackground, [isLoginPage, darkMode]);

  return (
    <DarkModeContext.Provider value={darkMode}>
      <ToastContainer
        position="top-center"
        theme={darkMode ? "dark" : "light"}
      />
      <Header
        handleShow={handleShow}
        handleClose={() => handleShow(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <Container fluid>
        <Sidebar
          show={show}
          handleClose={() => handleShow(false)}
        />
        <AppRoutes />   
      </Container>
    </DarkModeContext.Provider>
  );
};

export default Layout;