import TeamCard from "../../components/templates/TeamCard";
import LogoDark from "../../assets/img/logo_dark.png";
import { FaChartBar, FaVideo } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { Offcanvas, Nav } from "react-bootstrap";
import Logo from "../../assets/img/logo.png";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import "./sidebar.css";

import { MdFiberDvr } from "react-icons/md";

const Sidebar = ({ show, handleClose }) => {
  const darkMode = useDarkMode();

  const navigationItems = [
    { to: "/", text: "Dashboard", icon: <FaChartBar /> },
    { to: "/hikvision", text: "Hikvision", icon: <FaVideo /> },
    { to: "/samsung", text: "Samsung", icon: <MdFiberDvr /> },
  ];

  const renderNavigationLinks = () => {
    return navigationItems.map((item, index) => (
      <div key={index}>
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            isActive ? "active-link d-flex align-items-center gap-2" : "sidebar-link d-flex align-items-center gap-2"
          }
          onClick={handleClose}
        >
          {item.icon}
          {item.text}
        </NavLink>
        {item.submenu &&  (
          <div className="sub-menu">
            {item.submenu.map((subItem, subIndex) => (
              <NavLink
                key={subIndex}
                to={subItem.to}
                className={({ isActive }) =>
                  isActive ? "active-sublink" : "sidebar-sublink"
                }
                onClick={handleClose}
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

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll={true}
        backdrop={true}
        className="offcanvas sidebar shadow-sm"
      >
        <Offcanvas.Header closeButton>{renderLogo(darkMode)}</Offcanvas.Header>
        <hr />
        <Offcanvas.Body className="p-2">
          <Nav defaultActiveKey="/dashboard" className="flex-column">
            {renderNavigationLinks()}
            <TeamCard />
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
        src={darkMode[0] ? LogoDark : Logo}
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