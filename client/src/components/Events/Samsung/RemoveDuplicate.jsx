import { removeDuplicateEventsSamsung } from "../../../api/events";
import { Button, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useState } from "react";

const RemoveDuplicate = ({onUpdate}) => {
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteDuplicates = async () => {

    console.log("Date:", date);
    if (!date) {
      toast.error("Por favor, seleccione una fecha");
      return;
    }

    setIsLoading(true);

    try {
      const data = await removeDuplicateEventsSamsung(date);
      toast.success("Eventos duplicados eliminados");
      setDate("");
      console.log("Duplicate events deleted:", data);
      onUpdate();
    } catch (error) {
      toast.error("Error al eliminar eventos duplicados");
      console.error("Error deleting duplicate events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p>Eliminar Duplicados</p>
      <Form.Group className="border-2 bg-body-tertiary p-3 rounded-3">
        <Form.Control
          type="date"
          value={date}
          className="mb-3"
          onChange={(e) => setDate(e.target.value)}
          placeholder="Fecha de inicio"
        />
        <Button
          className="w-100"
          size="sm"
          variant="danger"
          onClick={handleDeleteDuplicates}
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : <><FaTimes /> Eliminar Duplicados</>}
        </Button>
      </Form.Group>
    </div>
  );
};

RemoveDuplicate.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};

export default RemoveDuplicate;
