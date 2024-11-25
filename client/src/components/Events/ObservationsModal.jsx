import { Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ObservationsModal = ({ show, handleClose, observation, setObservation, handleSave }) => {
  const [localObservations, setLocalObservations] = useState(observation);

  useEffect(() => {
    console.log("Observation prop changed:", observation);
    setLocalObservations(observation);
  }, [observation]);

  const handleObservationsChange = (event) => {
    const newObservations = event.target.value;
    console.log("Local observations updated:", newObservations);
    setLocalObservations(newObservations);
  };

  const saveObservations = () => {
    console.log("Saving observations..."); 
    if (localObservations.trim() === "") {
      alert("Observations cannot be empty.");
      return;
    }
    console.log("Observations to be saved:", localObservations); 
    setObservation(localObservations);
    handleSave(localObservations);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Observaciones</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="textarea"
          rows={3}
          value={localObservations}
          onChange={handleObservationsChange}
          placeholder="Ingrese las observaciones del evento..."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={saveObservations}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ObservationsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  observation: PropTypes.string,
  setObservation: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default ObservationsModal;

