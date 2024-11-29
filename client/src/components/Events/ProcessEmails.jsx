import { processEmail } from "../../api/email";
import { Form, Button, Container } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";

const ProcessEmails = () => {
  const [folder, setFolder] = useState("Prueba");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const handleProcessEmail = useCallback(async () => {
    try {
      const result = await processEmail(folder, date);
      console.log("Resultado del procesamiento de correos:", result);
    } catch (error) {
      console.error("Error al procesar correos:", error);
    }
  }, [folder, date]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleProcessEmail();
    }, 3600000);

    return () => clearInterval(interval);
  }, [handleProcessEmail]);

  return (
    <Container className="mt-4">
      <p>Procesar Correos Electrónicos</p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcessEmail();
        }}
        className="bg-body-tertiary p-3 rounded shadow-sm"
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="folderSelect">Seleccionar Carpeta:</Form.Label>
          <Form.Select
            id="folderSelect"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="form-select"
          >
            <option value="Prueba">PRUEBA</option>
            <option value="PROCESADOS">PROCESADOS</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="date">Fecha:</Form.Label>
          <Form.Control
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
        </Form.Group>
        <Button type="submit" variant="primary" size="sm" className="w-100">
          Procesar Correos
        </Button>
      </Form>
    </Container>
  );
};

export default ProcessEmails;
