import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const DetailHikvision = ({ show, handleClose, detail }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalle del evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Id:</strong> {detail.id}
        </p>
        <p>
          <strong>Fecha:</strong> {detail.eventType}
        </p>
        <p>
          <strong>Estado:</strong> {detail.cameraName}
        </p>
        <p>
          <strong>Observaciones:</strong> {detail.name}
        </p>
        <p>
          <strong>Adjunto:</strong> {detail.eventTime}
        </p>
        <p>
          <strong>Adjunto:</strong> {detail.status}
        </p>
        <p>
          <strong>Adjunto:</strong> {detail.observations}
        </p>
        <p>
          <strong>Adjunto:</strong> {detail.createdAt}
        </p>
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
