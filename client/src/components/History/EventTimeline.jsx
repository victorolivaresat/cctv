import { FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { useState, useEffect } from "react";
import { Chrono } from "react-chrono";
import PropTypes from "prop-types";

// Logo imports
import logoDarkSamsung from "../../assets/img/samsung_dark.png";
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";
import logoSamsung from "../../assets/img/samsung.png";

const EventTimeline = ({ events }) => {
  const { darkMode } = useDarkMode();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [darkMode, events]);

  const themeDark = {
    primary: "#4a90e2",
    secondary: "#357ABD",
    cardBgColor: "#2a3b5f",
    cardDetailsBackGround: "#1f2a3f",
    cardDetailsColor: "#e0e0e0",
    cardMediaBgColor: "#3a4d6f",
    cardSubtitleColor: "#9b9b9b",
    cardTitleColor: "#e0e0e0",
    detailsColor: "#b0b0b0",
    titleColor: "#b0b0b0",
    titleColorActive: "#ffffff",
    toolbarBgColor: "#3a4d6f",
    toolbarBtnBgColor: "#2a3b5f",
    toolbarTextColor: "#e0e0e0",
  };

  const themeLight = {
    secondary: "#b6d1ff",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "primary"; // Usamos el color primario de Bootstrap
      case "pending":
        return "warning"; // Usamos el color de advertencia de Bootstrap
      case "completed":
        return "success"; // Usamos el color de éxito de Bootstrap
      default:
        return "secondary"; // Un color neutro por defecto
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "new":
        return "Nuevo";
      case "pending":
        return "Pendiente";
      case "completed":
        return "Completado";
      default:
        return status;
    }
  };

  const translateAction = (action) => {
    switch (action) {
      case "Status Updated":
        return "Actualización de estado";
      case "Created":
        return "Creado";
      case "Deleted":
        return "Eliminado";
      default:
        return action;
    }
  };

  const getModelImage = (model) => {
    if (model === "EventHv") {
      return darkMode ? logoDarkHv : logoHikvision;
    } else if (model === "EventSamsung") {
      return darkMode ? logoDarkSamsung : logoSamsung;
    }
    return null;
  };

  const items = events.map((event) => {
    let details;
    try {
      details = JSON.parse(event.details);
    } catch (error) {
      console.error("Error parsing event details:", error);
      details = {
        previousStatus: "unknown",
        newStatus: "unknown",
        name: "unknown",
        eventType: "unknown",
        createdAt: "unknown",
        eventTime: "unknown",
      };
    }

    return {
      title: new Date(event.created_at).toLocaleString(),
      cardTitle: translateAction(event.action),
      cardSubtitle: (
        <img
          src={getModelImage(event.model)}
          alt={event.model}
          className="me-3"
          width={100}
        />
      ),
      timelineContent: (
        <>
          <div className="mb-2">
            <span className="bg-warning-subtle px-4 rounded-2">
              {details.name} {" : "}
              {details.eventType}
            </span>
            <span className=" d-block my-1">
              <FaCalendarCheck className="me-1 text-success" />
              Fecha De Registro: {new Date(
                details.createdAt
              ).toLocaleString()}{" "}
              <FaCalendarAlt className="ms-4 me-1 text-bg-primary" />
              Fecha del DVR: {new Date(details.eventTime).toLocaleString()}
            </span>
          </div>
          <div className="mb-2">
            Estado Anterior:{" "}
            <span
              className={`px-2 bg-${getStatusColor(
                details.previousStatus
              )} rounded-2 text-bg-${getStatusColor(details.previousStatus)}`}
            >
              {translateStatus(details.previousStatus)}
            </span>
            &nbsp; - &nbsp; Nuevo Estado:{" "}
            <span
              className={`px-2 bg-${getStatusColor(
                details.newStatus
              )} rounded-2 text-bg-${getStatusColor(details.newStatus)}`}
            >
              {translateStatus(details.newStatus)}
            </span>
          </div>
        </>
      ),
    };
  });

  return (
    <div style={{ height: "600px" }}>
      <Chrono
        key={key}
        items={items}
        theme={darkMode ? themeDark : themeLight}
        mode="VERTICAL"
        cardHeight={180}
      />
    </div>
  );
};

EventTimeline.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventTimeline;
