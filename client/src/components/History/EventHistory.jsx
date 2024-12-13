import {
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaRegClock,
  FaExchangeAlt,
} from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

// Logo imports
import logoDarkSamsung from "../../assets/img/samsung_dark.png";
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";
import logoSamsung from "../../assets/img/samsung.png";

const EventHistory = ({ events }) => {
  const { darkMode } = useDarkMode();

  const getLogo = (model) => {
    if (model === "EventHv") {
      return darkMode ? logoDarkHv : logoHikvision;
    } else if (model === "EventSamsung") {
      return darkMode ? logoDarkSamsung : logoSamsung;
    }
    return null;
  };

  return (
    <>
      {events.map((event, index) => (
        <Card key={index} className="fs-6 mb-4 shadow bg-body-tertiary">
          <Card.Body>
            {/* <Card.Title>
              <img
                src={getLogo(event.model)}
                alt={`${event.model}`}
                className="me-3"
                width={90}
              />
            </Card.Title>
            <Card.Text className="text-success">
              <strong>
                <FaCheckCircle className="me-1" /> Atendidos:
              </strong>{" "}
              {event.attended}
            </Card.Text>
            <Card.Text className="text-warning">
              <strong>
                <FaHourglassHalf className="me-1" /> En Espera:
              </strong>{" "}
              {event.pending}
            </Card.Text>
            <Card.Text className="text-primary">
              <strong>
                <FaRegClock className="me-1" /> Última Actualización:
              </strong>{" "}
              {new Date(event.last_update).toLocaleString()}
            </Card.Text>
            <Card.Text className="text-secondary">
              <strong>
                <FaExclamationTriangle className="me-1" /> Último Estado: &nbsp;
              </strong>
              {event.last_status === "pending" ? (
                <span className="text-warning bg-warning-subtle px-2 py-1 rounded-3">
                  Pendiente
                </span>
              ) : event.last_status === "completed" ? (
                <span className="text-success bg-success-subtle px-2 py-1 rounded-3">
                  Completado
                </span>
              ) : (
                "Estado desconocido"
              )}
            </Card.Text> */}
            {/* Nuevas secciones para las transiciones */}
            <Card.Text className="text-info">
              <strong>
                <FaExchangeAlt className="me-1" /> Transiciones:
              </strong>
            </Card.Text>
            <Card.Text className="ms-4">
              <span className="text-secondary">
                <strong>Nuevo → Completado:</strong> {event.new_to_completed}
              </span>
            </Card.Text>
            <Card.Text className="ms-4">
              <span className="text-secondary">
                <strong>Nuevo → Pendiente:</strong> {event.new_to_pending}
              </span>
            </Card.Text>
            <Card.Text className="ms-4">
              <span className="text-secondary">
                <strong>Pendiente → Completado:</strong>{" "}
                {event.pending_to_completed}
              </span>
            </Card.Text>
            <Card.Text className="ms-4">
              <span className="text-secondary">
                <strong>Completado → Pendiente:</strong>{" "}
                {event.completed_to_pending}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

EventHistory.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventHistory;
