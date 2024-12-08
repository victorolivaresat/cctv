import { useState, useCallback } from "react";
import {
  Card,
  Form,
  Button,
  Spinner,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { FaPlay, FaEnvelope, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import {
  validateDateRange,
  getTomorrowDate,
  getYesterdayDate,
} from "../../utils/DateUtils";
import { processEmail } from "../../api/email";

const ProcessEmails = () => {
  const folder = "INBOX";
  const [showModal, setShowModal] = useState(false);
  const [brand, setBrand] = useState("hikvision");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { currentUser } = useAuth();

  console.log("Usuario actual:", currentUser.userId);

  const [startDate, setStartDate] = useState(getYesterdayDate());
  const [endDate, setEndDate] = useState(getTomorrowDate());

  const handleProcessEmail = useCallback(async () => {
    setLoading(true);
    setProgress(25);
    try {
      if (!startDate || !endDate) {
        toast.error("¡Las fechas de inicio y fin no pueden estar vacías!");
        return;
      }
      if (!validateDateRange(startDate, endDate)) {
        toast.error("¡La fecha de inicio debe ser menor a la fecha de fin!");
        return;
      }
      setProgress(50);
      const result = await processEmail(folder, startDate, endDate, brand);
      console.log("Resultado:", result);
      setProgress(100);
      toast.success("¡Correos procesados exitosamente!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Hubo un error al procesar los correos.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [folder, startDate, endDate, brand]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <Card className="shadow-sm p-4 bg-body-tertiary">
      <Card.Header className="text-center bg-primary text-white rounded-2">
        <h5>
          <FaEnvelope className="me-2" />
          Procesar Correos
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Carpeta:</Form.Label>
            <Form.Control type="text" value={folder} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Inicio:</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Fin:</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Marca:</Form.Label>
            <Form.Select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="hikvision">Hikvision</option>
              <option value="samsung">Samsung</option>
            </Form.Select>
          </Form.Group>
          {currentUser.userId === 1 ? (
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />{" "}
                  Procesando...
                </>
              ) : (
                <>
                  <FaPlay className="me-2" />
                  Ejecutar
                </>
              )}
            </Button>
          ) : (
            <div className="text-center text-danger">Sin permisos</div>
          )}
        </Form>
        {loading && (
          <div className="mt-3">
            <ProgressBar animated now={progress} label={`${progress}%`} />
          </div>
        )}
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaInfoCircle className="me-2" />
            Confirmación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas procesar los correos?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              handleProcessEmail();
            }}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default ProcessEmails;
