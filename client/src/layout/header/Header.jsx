import { Container, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { getNewNotificationsCount } from "../../api/events";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/img/logo.jpg";
import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import PropTypes from "prop-types";
import "./header.css";

const Header = ({ handleShow, handleClose }) => {
  const [notifications, setNotifications] = useState({ hv: 0, samsung: 0 });
  const { logoutUser, currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNewNotificationsCount();
        setNotifications(data);

        console.log(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [setNotifications]);

  if (location.pathname === "/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      handleClose();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <Navbar className="shadow-sm">
      <Container fluid>
        {/* Brand Section */}
        <Navbar.Brand href="/" className="mx-2">
          <img
            alt="Logo"
            src={Logo}
            width="40"
            className="d-inline-block align-top rounded-3 me-3 shadow-sm"
          />
        </Navbar.Brand>
        {/* Left Section */}
        <Nav className="me-auto">
          <Nav.Link href="#" onClick={() => handleShow(true)}>
            <BiMenu size={25} />
          </Nav.Link>
        </Nav>
        {/* Right Section */}
        <Nav className="align-items-center fs-5">
          {/* Alerts Dropdown */}
          <NavDropdown
            align="end"
            title={
              <FaBell
                className={
                  notifications.samsung > 0 || notifications.hv > 0
                    ? "bell-alert text-danger"
                    : ""
                }
              />
            }
            className="mx-2 dropdown-alerts"
          >
            <NavDropdown.Header>Nuevas Alertas</NavDropdown.Header>
            <NavDropdown.Item
              href="#action/1.1"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div>Hikvision</div>
              </div>
              <Badge bg="success" pill>
                {notifications.hv}
              </Badge>
            </NavDropdown.Item>
            <NavDropdown.Item
              href="#action/1.2"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div>Samsung</div>
              </div>
              <Badge bg="primary" pill>
                {notifications.samsung}
              </Badge>
            </NavDropdown.Item>
          </NavDropdown>
          {/* User Dropdown */}
          <NavDropdown
            align="end"
            title={
              <img
                src="https://picsum.photos/200"
                className="rounded-circle"
                width="30"
                alt="User"
              />
            }
            className="mx-2 dropdown-users"
          >
            <div className="m-3 p-2 text-center">
              <img
                className="rounded-circle shadow-sm"
                src="https://picsum.photos/200"
                width="80"
                alt="User"
              />
              <div className="my-2 small text-muted">
                {currentUser && currentUser.email}
              </div>
            </div>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.2">
              <FaCog />
              &nbsp;Config
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#" onClick={handleLogout}>
              <FaSignOutAlt />
              &nbsp;Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

Header.propTypes = {
  handleShow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Header;
