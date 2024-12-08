import { FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

// Logo imports
import logoDarkSamsung from "../../assets/img/samsung_dark.png";
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";
import logoSamsung from "../../assets/img/samsung.png";

const NewNotifications = ({ notifications }) => {
  const { darkMode } = useDarkMode();

  const getLogo = (key) => {
    if (key === "hv") {
      return darkMode ? logoDarkHv : logoHikvision;
    } else if (key === "samsung") {
      return darkMode ? logoDarkSamsung : logoSamsung;
    }
    return null;
  };

  return (
    <div>
      {Object.keys(notifications).map((key) => (
        <Alert key={key} variant="light shadow" className="">
          <div>
            <img
              src={getLogo(key)}
              alt={`${key} logo`}
              className="me-3"
              width={90}
            />
            <p className="my-2 fs-5 blink">
              Nuevas {" "}
              <span className="badge rounded-pill bg-primary">
                {notifications[key].new}
              </span>
            </p>
            <p className="my-2 text-success">
              <FaCheckCircle className="me-2" />
              Completadas: {notifications[key].completed}
            </p>
            <p className="my-2 text-warning">
              <FaClock className="me-2" />
              Pendientes: {notifications[key].pending}
            </p>
            <hr className="my-1" />
            <p className="my-2">
              <FaTasks className="me-2" />
              Total: {notifications[key].total}
            </p>
          </div>
        </Alert>
      ))}
    </div>
  );
};

NewNotifications.propTypes = {
  notifications: PropTypes.object.isRequired,
};

export default NewNotifications;
