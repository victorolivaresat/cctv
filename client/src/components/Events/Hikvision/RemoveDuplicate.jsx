import { removeDuplicateEventsHv } from "../../../api/events";
import { Button, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";

const DeleteDuplicate = () => {
  const [date, setDate] = useState("");

  const handleDeleteDuplicates = async () => {
    if (date) {
      toast.error("Por favor, seleccione una fecha");
      return;
    }

    try {
      const data = await removeDuplicateEventsHv(date);
      toast.success("Eventos duplicados eliminados");
      setDate("");
      console.log("Duplicate events deleted:", data);
    } catch (error) {
      toast.error("Error al eliminar eventos duplicados");
      console.error("Error deleting duplicate events:", error);
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
        >
          <FaTimes /> &nbsp; Eliminar Duplicados
        </Button>
      </Form.Group>
    </div>
  );
};

export default DeleteDuplicate;
