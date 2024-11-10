import DarkModeContext from "../../contexts/DarkModeContext";
import { Offcanvas, Nav, Button } from "react-bootstrap";
import LogoDark from "../../assets/img/logo_dark.png";
import { useAuth } from "../../contexts/AuthContext";
import { FaChartBar, FaTasks  } from "react-icons/fa";
import { BsBoxArrowRight } from "react-icons/bs";
import Logo from "../../assets/img/logo.png";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { useContext } from "react";
import TeamCard from "./TeamCard";
import "./Sidebar.css";
import { useState } from "react";

const Sidebar = ({ show, handleClose }) => {

  const { logoutUser } = useAuth();
  const darkMode = useContext(DarkModeContext);
  const [submenuVisible, setSubmenuVisible] = useState(false);

  const navigationItems = [
    { to: "/", text: "Dashboard", icon: <FaChartBar /> },
    { to: "/events", text: "Events", icon: <FaTasks /> },
    { to: "/events/suport", text: "Events-Suport", icon: <FaTasks /> },
  ];

  const handleNavLinkClick = () => {
    handleClose();
  };

  const handleTransactionClick = () => {
    // Mostrar u ocultar submenús cuando se hace clic en la opción "Transaction"
    setSubmenuVisible(!submenuVisible);
  };

  const renderNavigationLinks = () => {
    return navigationItems.map((item, index) => (
      <div key={index}>
        <NavLink
          to={item.to}
          className="sidebar-header"
          onClick={item.submenu ? handleTransactionClick : handleNavLinkClick}
        >
          <span className="d-flex align-items-center gap-2">
            {item.icon}
            {item.text}
          </span>
        </NavLink>
        {/* Renderizar submenú si existe y es visible */}
        {item.submenu && submenuVisible && (
          <div className="sub-menu">
            {item.submenu.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                to={subItem.to}
                className="sidebar-sublink"
                onClick={handleNavLinkClick}
              >
                <span className="d-flex align-items-center gap-1">
                  {subItem.icon}
                  {subItem.text}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    ));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      handleClose();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll={true}
        backdrop={true}
        className="offcanvas sidebar shadow-sm"
        onMouseLeave={handleClose}
      >
        <Offcanvas.Header closeButton>{renderLogo(darkMode)}</Offcanvas.Header>
        <hr />
        <Offcanvas.Body className="p-2">
          <Nav defaultActiveKey="/dashboard" className="flex-column">
            <span className="sidebar-header">Admin Elements</span>
            {renderNavigationLinks()}
            <hr />
            <span className="sidebar-header">Users Management</span>
            <hr />
            <TeamCard />
            <Button
              onClick={handleLogout}
              className="d-flex align-items-center justify-content-center gap-2 mx-3"
              variant="outline-primary"
            >
              <BsBoxArrowRight /> Log Out
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

const renderLogo = (darkMode) => {
  return (
    <a
      className="d-flex justify-content-center"
      href="/"
      data-mdb-ripple-color="primary"
    >
      <img
        id="at-logo"
        src={darkMode ? LogoDark : Logo}
        alt="ATLogo"
        draggable="false"
        width={150}
      />
    </a>
  );
};

Sidebar.propTypes = {
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

export default Sidebar;
