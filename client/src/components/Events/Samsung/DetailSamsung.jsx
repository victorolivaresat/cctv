import { formatDate } from "../../../utils/DateUtils";
import { FaCheck, FaCopy } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const DetailSamsung = ({ show, handleClose, detail }) => {
  console.log(detail);

  const copyToClipboard = () => {
    const text = `
      Nombre: ${detail.name}
      Evento: ${detail.event_name}
      Estado: ${
        detail.status === "new"
          ? "Nuevo"
          : detail.status === "pending"
          ? "Pendiente"
          : "Completado"
      }
      Fecha DVR: ${formatDate(detail.event_time)}
      Registrado: ${formatDate(detail.created_at)}
      Observaciones: ${detail.observations ? detail.observations : "-"}
    `;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.info("¡Detalle copiado al portapapeles!");
        })
        .catch((err) => {
          console.error("Error al copiar al portapapeles: ", err);
          toast.error("No se pudo copiar al portapapeles.");
        });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  // Método de respaldo
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Evita que el elemento influya en el diseño de la página
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0"; // Invisible
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        toast.info("¡Detalle copiado al portapapeles!");
      } else {
        toast.warn(
          "No se pudo copiar el texto. Selecciona y copia manualmente."
        );
      }
    } catch (err) {
      console.error(
        "Error al copiar al portapapeles con método de respaldo: ",
        err
      );
      toast.error("No se pudo copiar al portapapeles.");
    }

    document.body.removeChild(textArea);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalle dl Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fs-6">
        <p className="p-2 bg-danger bg-opacity-50 rounded-3">
          <strong>
            <FaCheck />
            &nbsp; {detail.name}
          </strong>
        </p>
        <div style={{ whiteSpace: "pre-line" }}>
          <strong>Evento: &nbsp;</strong>
          <div
            className="my-1 p-2 bg-body-tertiary overflow-y-scroll rounded-3"
            style={{ height: "110px" }}
          >
            {detail.event_name}
          </div>
        </div>
        <p className="mt-3">
          <strong>Estado: &nbsp;</strong>
          {detail.status === "new" ? (
            <span className="px-3 text-bg-primary bg-primary rounded-4">
              Nuevo
            </span>
          ) : detail.status === "pending" ? (
            <span className="px-3 text-bg-warning  bg-warning rounded-4">
              Pendiente
            </span>
          ) : (
            <span className="px-3 text-bg-success bg-success rounded-4">
              Completado
            </span>
          )}
        </p>
        <p>
          <strong>Observaciones: </strong>{" "}
          {detail.observations ? detail.observations : "-"}
        </p>
        <Button variant="secondary" onClick={copyToClipboard}>
          <FaCopy /> Copiar
        </Button>
      </Modal.Body>
    </Modal>
  );
};

DetailSamsung.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  detail: PropTypes.object,
};

export default DetailSamsung;
