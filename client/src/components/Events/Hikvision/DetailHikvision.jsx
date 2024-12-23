import { formatDate } from "../../../utils/DateUtils";
import { Modal, Button } from "react-bootstrap";
import { FaCheck, FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const DetailHikvision = ({ show, handleClose, detail }) => {
  const formatCameraName = (name) => {
    if (!name || name == "null" || name == "") return "Sin datos";
    const parts = name.split(")");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && ")"}
        {index < parts.length - 1 && <br />}
      </span>
    ));
  };

  const copyToClipboard = () => {
    const text = `
      Nombre: ${detail.name}
      Evento: ${detail.event_type}
      Cámara: ${detail.camera_name}
      Estado: ${
        detail.status === "new"
          ? "Nuevo"
          : detail.status === "pending"
          ? "Pendiente"
          : "Completado"
      }
      Fecha DVR: ${formatDate(detail.event_time)}
      Fecha Email: ${formatDate(detail.inbox_date)}
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
        });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      toast.info("¡Detalle copiado al portapapeles!");
    } catch (err) {
      console.error(
        "Error al copiar al portapapeles con método de respaldo: ",
        err
      );
    }

    document.body.removeChild(textArea);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalle del Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fs-6">
        <p className="p-2 bg-danger text-bg-danger rounded-3">
          <strong>
            <FaCheck />
            &nbsp; {detail.name}
          </strong>
        </p>
        <div className="p-2">
          <p>
            <strong>Evento: </strong> {detail.event_type}
          </p>
          <div className="p-2 bg-body-tertiary rounded-2">
            <span className="">Cámara: </span>
            <p className="overflow-auto" style={{ height: "50px" }}>
              {formatCameraName(detail.camera_name)}
            </p>
          </div>

          <p className="mt-3">
            <strong>Estado: &nbsp;</strong>
            {detail.status === "new" ? (
              <span className="px-3 text-bg-primary bg-primary rounded-4">
                Nuevo
              </span>
            ) : detail.status === "pending" ? (
              <span className="px-3 text-bg-warning bg-warning rounded-4">
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
        </div>
        <Button variant="secondary" onClick={copyToClipboard}>
          <FaCopy /> Copiar
        </Button>
      </Modal.Body>
    </Modal>
  );
};

DetailHikvision.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  detail: PropTypes.object.isRequired,
};

export default DetailHikvision;
