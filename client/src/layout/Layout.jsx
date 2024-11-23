
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import AppRoutes from "../routes/Routes";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";

const URL_IMAGE_DARK = "url('../src/assets/img/login_bg_dark.svg')";
const URL_IMAGE_LIGHT = "url('../src/assets/img/login_bg_ligth.svg')";

const Layout = () => {
 
  const [show, setShow] = useState(false);
  const [darkMode] = useDarkMode();
  const location = useLocation();
  
  console.log(darkMode);

  const isLoginPage = location.pathname === '/login';

  const handleShow = (value) => setShow(value);

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