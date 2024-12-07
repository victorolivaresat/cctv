import { validateDateRange } from "../../utils/DateUtils";
import { useState, useEffect, useCallback } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { processEmail } from "../../api/email";
import { toast } from "react-toastify";
import {
  formatDateInput,
  getTomorrowDate,
  getYesterdayDate,
} from "../../utils/DateUtils";
import { FaPlay } from "react-icons/fa";

const ProcessEmails = () => {
  const folder = "INBOX";
  const [brand, setBrand] = useState("hikvision");
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(
    formatDateInput(getYesterdayDate())
  );
  const [endDate, setEndDate] = useState(formatDateInput(getTomorrowDate()));

  const handleProcessEmail = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Procesando correos...");
      console.log("Carpeta:", folder);
      console.log("Fecha de inicio:", startDate);
      console.log("Fecha de fin:", endDate);
      console.log("Marca:", brand);

      if (!startDate || !endDate) {
        toast.error("¡Las fechas de inicio y fin no pueden estar vacías!");
        return;
      }

      if (!validateDateRange(startDate, endDate)) {
        toast.error("¡La fecha de inicio debe ser menor a la fecha de fin!");
        return;
      }
      const result = await processEmail(folder, startDate, endDate, brand);
      console.log("Resultado del procesamiento de correos:", result);
      toast.success("¡Correos procesados exitosamente!");
    } catch (error) {
      console.error("Error al procesar correos:", error);
    } finally {
      setLoading(false);
    }
  }, [folder, startDate, endDate, brand]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleProcessEmail();
    }, 3600000);

    return () => clearInterval(interval);
  }, [handleProcessEmail]);

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcessEmail();
        }}
        className="bg-body-tertiary p-3 rounded shadow-sm"
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="folderInput">Carpeta:</Form.Label>
          <Form.Control
            type="text"
            id="folderInput"
            value={folder}
            readOnly
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="startDate">Fecha y Hora de Inicio:</Form.Label>
          <Form.Control
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="endDate">Fecha y Hora de Fin:</Form.Label>
          <Form.Control
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="brandSelect">Seleccionar Marca:</Form.Label>
          <Form.Select
            id="brandSelect"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="form-select"
          >
            <option value="hikvision">Hikvision</option>
            <option value="samsung">Samsung</option>
          </Form.Select>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Procesando...
            </>
          ) : (
            <>
              <FaPlay className="me-2" />
              Ejecutar
            </>
          )}
        </Button>
      </Form>
    </>
  );
};

export default ProcessEmails;
