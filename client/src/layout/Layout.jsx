import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import AppRoutes from "../routes/routes";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const Layout = () => {
  const [show, setShow] = useState(false);
  const { darkMode } = useDarkMode();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const handleShow = (value) => setShow(value);

  const updateBackground = () => {
    const root = document.getElementById('root');
    if (isLoginPage) {
      root.style.backgroundColor = darkMode ? "#333" : "#f5f5f5";
    } else {
      root.style.backgroundColor = "transparent";
    }
  };

  useEffect(updateBackground, [isLoginPage, darkMode]);

  return (
    <>
      <ToastContainer
        position="top-center"
        theme={darkMode ? "dark" : "light"}
      />
      <Header
        handleShow={handleShow}
        handleClose={() => handleShow(false)}
        darkMode={darkMode}
      />
      <Container fluid>
        <Sidebar
          show={show}
          handleClose={() => handleShow(false)}
        />
        <AppRoutes />
      </Container>
    </>
  );
};

export default Layout;
