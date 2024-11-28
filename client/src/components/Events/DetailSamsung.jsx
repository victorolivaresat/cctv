import { formatDate } from "../../utils/DateUtils";
import { FaCheck, FaCopy } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const DetailSamsung = ({ show, handleClose, detail }) => {
  console.log(detail);

  const copyToClipboard = () => {
    const text = `
      Nombre: ${detail.name}
      Evento: ${detail.eventName}
      Estado: ${
        detail.status === "new"
          ? "Nuevo"
          : detail.status === "pending"
          ? "Pendiente"
          : "Completado"
      }
      Fecha DVR: ${formatDate(detail.dateTime)}
      Registrado: ${formatDate(detail.createdAt)}
      Observaciones: ${detail.observations ? detail.observations : "-"}
    `;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.info("¡Detalle copiado al portapapeles!");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles: ", err);
      });
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
            {detail.eventName}
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
          <strong>Fecha DVR: </strong> {formatDate(detail.dateTime)}
        </p>
        <p>
          <strong>Registrado: </strong> {formatDate(detail.createdAt)}
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
