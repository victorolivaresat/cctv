import { Container, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import Logo from "../../assets/img/logo.jpg";
import { BiMenu } from "react-icons/bi";
import PropTypes from "prop-types";
import io from "socket.io-client";
import "./Topbar.css";
import {
  FaBell,
  FaSun,
  FaMoon,
  FaCheck,
  FaTimes,
  FaInfo,
  FaCog,
  FaSignOutAlt

} from "react-icons/fa";

const Topbar = ({ handleShow, handleClose, darkMode, toggleDarkMode }) => {
  const { logoutUser, currentUser } = useAuth();
  const socket = io("http://localhost:5000");
  const [message, setMessage] = useState({
    text: null,
    color: null,
    icon: null,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      handleClose();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  useEffect(() => {
    let timerId;
    socket.on("allEmailsProcessed", () => {
      setMessage({
        text: "All emails processed",
        color: "text-success",
        icon: <FaCheck />,
      });
      timerId = setTimeout(
        () => setMessage({ text: null, color: null, icon: null }),
        5000
      );
    });

    socket.on("nothingToProcess", () => {
      setMessage({
        text: "Nothing to process",
        color: "text-info",
        icon: <FaInfo />,
      });
      timerId = setTimeout(
        () => setMessage({ text: null, color: null, icon: null }),
        5000
      );
    });

    socket.on("imapConnectionError", (data) => {
      setMessage({
        text: data.message,
        color: "text-danger",
        icon: <FaTimes />,
      });
      timerId = setTimeout(
        () => setMessage({ text: null, color: null, icon: null }),
        5000
      );
    });

    return () => {
      socket.off("imapConnectionError");
      socket.off("nothingToProcess");
      socket.off("allEmailsProcessed");

      clearTimeout(timerId);
    };
  }, [message, socket]);

  return (
    <Navbar className="shadow-sm">
      <Container fluid>
        {/* Right Items */}
        <Navbar.Brand href="/" className="mx-2">
          <img
            alt="Logo"
            src={Logo}
            width="40"
            className="d-inline-block align-top rounded-3 me-3 shadow-sm"
          />
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#" onClick={() => handleShow(true)}>
            <BiMenu size={25} />
          </Nav.Link>
        </Nav>
        {/* Left Items */}
        <Nav className="align-items-center fs-5">
          {/* Dark Mode */}
          <Nav.Item className="mx-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleDarkMode();
              }}
            >
              {darkMode ? (
                <FaMoon className="text-light" />
              ) : (
                <FaSun className="text-warning" />
              )}
            </a>
          </Nav.Item>
          {/* Alerts */}
          <NavDropdown
            align="end"
            title={<FaBell />}
            className="mx-2 dropdown-alerts"
          >
            <NavDropdown.Item
              href="#action/1.1"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div>Alert Hikvision</div>
              </div>
              <Badge bg="success" pill>
                8
              </Badge>
            </NavDropdown.Item>
            <NavDropdown.Item
              href="#action/1.2"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div>Alert Samsung</div>
              </div>
              <Badge bg="primary" pill>
                12
              </Badge>
            </NavDropdown.Item>
            {message.text && (
              <>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/1.3" className={message.color}>
                  {message.icon} &nbsp;
                  {message.text}
                </NavDropdown.Item>
              </>
            )}
          </NavDropdown>
          {/* Users */}
          <NavDropdown
            align="end"
            title={
              <img
                src="https://picsum.photos/200"
                className="rounded-circle"
                width="30"
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
            <NavDropdown.Divider /> {/* Separador aquí */}
            <NavDropdown.Item href="#action/3.4" onClick={handleLogout}>
              <FaSignOutAlt />
              &nbsp;Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

Topbar.propTypes = {
  handleShow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Topbar;
