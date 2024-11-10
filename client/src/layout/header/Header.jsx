import { useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import PropTypes from "prop-types";

const Header = ({ handleShow, handleClose, darkMode, toggleDarkMode }) => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return null;
  }

  return (
    <>
      <Topbar
        handleShow={handleShow}
        handleClose={handleClose}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </>
  );
};

Header.propTypes = {
  handleShow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Header;
