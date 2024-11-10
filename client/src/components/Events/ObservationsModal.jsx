import { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const ObservationsModal = ({ show, handleClose, observation, setObservation, handleSave }) => {
  const [localObservations, setLocalObservations] = useState(observation);

  useEffect(() => {
    console.log("Observation prop changed:", observation); // Verifica el valor de la observación cuando el prop cambia
    setLocalObservations(observation);
  }, [observation]);

  const handleObservationsChange = (event) => {
    const newObservations = event.target.value;
    console.log("Local observations updated:", newObservations); // Verifica el nuevo valor al cambiar el textarea
    setLocalObservations(newObservations);
  };

  const saveObservations = () => {
    console.log("Saving observations..."); // Mensaje de depuración al intentar guardar
    if (localObservations.trim() === "") {
      alert("Observations cannot be empty.");
      return;
    }
    console.log("Observations to be saved:", localObservations); // Verifica el valor que se va a guardar
    setObservation(localObservations);
    handleSave(localObservations);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{`Edit Observations`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          as="textarea"
          rows={3}
          value={localObservations}
          onChange={handleObservationsChange}
          placeholder="Enter your observations here..."
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={saveObservations}>
          Save Changes
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

