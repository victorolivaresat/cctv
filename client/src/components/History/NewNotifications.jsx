import useDarkMode from "../../hooks/useDarkMode";
import { Alert } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
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
    <>
      {Object.entries(notifications).map(
        ([key, count]) =>
          count > 0 && (
            <Alert
              key={key}
              variant="info"
              className="d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center">
                <FaBell className="me-3" size={20} />
                <div>
                  <img
                    src={getLogo(key)}
                    alt={`${key} logo`}
                    className="me-3"
                    width={90}
                  />
                  <p className="my-2 fs-6">{count} Nuevas notificaciones</p>
                </div>
              </div>
              <span
                className="badge rounded-pill bg-primary"
                style={{ fontSize: "12px" }}
              >
                {count}
              </span>
            </Alert>
          )
      )}
    </>
  );
};

NewNotifications.propTypes = {
  notifications: PropTypes.object.isRequired,
};

export default NewNotifications;
