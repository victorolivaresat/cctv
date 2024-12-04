import { processEmail } from "../../api/email";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";

const ProcessEmails = () => {
  const folder = "INBOX";
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  });
  const [brand, setBrand] = useState("hikvision");

  const handleProcessEmail = useCallback(async () => {
    try {
      console.log("Procesando correos...");
      console.log("Carpeta:", folder);
      console.log("Fecha de inicio:", startDate);
      console.log("Fecha de fin:", endDate);
      console.log("Marca:", brand);
      const result = await processEmail(folder, startDate, endDate, brand);
      console.log("Resultado del procesamiento de correos:", result);
    } catch (error) {
      console.error("Error al procesar correos:", error);
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
        <Button type="submit" variant="primary" size="sm" className="w-100">
          Procesar Correos
        </Button>
      </Form>
    </>
  );
};

export default ProcessEmails;
