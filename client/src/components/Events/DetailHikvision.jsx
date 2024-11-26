import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const DetailHikvision = ({ show, handleClose, detail }) => {
  const formatCameraName = (name) => {
    if (!name) return "";
    const parts = name.split(")");
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 2 && ")"}
        {index < parts.length - 2 && <br />}
      </span>
    ));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalle del evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="p-2 bg-danger bg-opacity-50 rounded-3">
          <strong>{detail.name}</strong>
        </p>
        <div className="p-2">
          <p>
            <strong>Evento: </strong> {detail.eventType}
          </p>
          <div className="p-2 bg-body-tertiary rounded-2">
            <span className="">Cámara: </span>
            <p className="overflow-auto" style={{ height: "50px" }}>
              {formatCameraName(detail.cameraName)}
            </p>
          </div>

          <p className="mt-3">
            <strong>Estado: &nbsp;</strong>
            {detail.status === "new" ? (
              <span className="px-3 bg-primary bg-opacity-25 rounded-4">Nuevo</span>
            ) : detail.status === "pending" ? (
              <span className="px-3 bg-warning rounded-4">Pendiente</span>
            ) : (
              <span className="px-3 bg-success rounded-4">Completado</span>
            )}
          </p>
          <p>
            <strong>Fecha DVR: </strong> {detail.eventTime}
          </p>
          <p>
            <strong>Registrado: </strong> {detail.createdAt}
          </p>
        </div>
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
