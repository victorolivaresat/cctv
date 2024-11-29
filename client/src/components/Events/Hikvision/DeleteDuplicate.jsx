import { deleteDuplicateEventsHv } from "../../../api/events";
import { Button, Form } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useState } from "react";


const DeleteDuplicate = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDeleteDuplicates = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor, seleccione una fecha de inicio y fin");
      return;
    }

    try {
      const data = await deleteDuplicateEventsHv(startDate, endDate);
      toast.success("Eventos duplicados eliminados");
      setStartDate("");
      setEndDate("");
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
          value={startDate}
          className="mb-3"
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Fecha de inicio"
        />
        <Form.Control
          type="date"
          value={endDate}
          className="mb-3"
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Fecha de fin"
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
