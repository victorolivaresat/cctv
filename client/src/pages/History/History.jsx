import { getYesterdayDate, getTomorrowDate } from "../../utils/DateUtils";
import NewNotifications from "../../components/History/NewNotifications";
import EventTimeline from "../../components/History/EventTimeline";
import { Row, Col, Spinner, Form, Card } from "react-bootstrap";
import EventHistory from "../../components/History/EventHistory";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getNewNotificationsCountByDate,
  getEventSummaryByDateRange,
  getEventHistoryTimeline,
} from "../../api/events";

const History = () => {
 
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [startDate, setStartDate] = useState(getYesterdayDate());
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [endDate, setEndDate] = useState(getTomorrowDate());
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [notifications, setNotifications] = useState({});
  const [eventTimeline, setEventTimeline] = useState([]);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents(startDate, endDate);
    handleDateChange(startDate, endDate);
    handleEventTimeline(startDate, endDate);
  }, [startDate, endDate]);

  const fetchEvents = async (startDate, endDate) => {
    try {
      const result = await getEventSummaryByDateRange(startDate, endDate);
      setEvents(result);
    } catch (err) {
      setError("Error al cargar los eventos");
      toast.error("Error al cargar los eventos");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleDateChange = async (startDate, endDate) => {
    try {
      const result = await getNewNotificationsCountByDate(startDate, endDate);
      setNotifications(result);
    } catch (err) {
      setError("Error al cargar las notificaciones");
      toast.error("Error al cargar las notificaciones");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleEventTimeline = async (startDate, endDate) => {
    try {
      const result = await getEventHistoryTimeline(startDate, endDate);
      setEventTimeline(result);
    } catch (err) {
      setError("Error al cargar el historial de eventos");
      toast.error("Error al cargar el historial de eventos");
    } finally {
      setLoadingTimeline(false);
    }
  };

  if (loadingEvents || loadingNotifications || loadingTimeline) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    setTimeout(() => {
      navigate("/");
    }, 5000);
    
    return (
      <div className=" d-flex justify-content-center mt-4 text-center">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="bg-danger-subtle p-4 rounded-3">
            <FaExclamationTriangle size={50} className="text-danger mb-3" />
            <h4 className="text-danger">Sin datos</h4>
            <p className="text-muted">
              No se encontraron datos para el rango de fechas seleccionado.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
    );
  }

  return (
    <div>
      <Row className="g-3 mt-2">
        <Col sm={12} md={6} lg={2}>
          <Card className="mb-4 shadow-sm bg-body-tertiary px-2">
            <Card.Body>
              <Form as={Row}>
                <Form.Group controlId="startDate" className="mb-3">
                  <Form.Label>Fecha de inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="endDate" className="mb-3">
                  <Form.Label>Fecha de fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          <span className="mb-2 d-block text-primary bg-primary-subtle p-2 rounded-2">
            <FaBell className="me-2" />
            Notificaciones
          </span>
          <NewNotifications notifications={notifications} />
        </Col>
        <Col sm={12} md={6} lg={7}>
          <EventTimeline events={eventTimeline} />
        </Col>
        <Col sm={12} md={6} lg={3}>
          <EventHistory events={events} />
        </Col>
      </Row>
    </div>
  );
};

export default History;