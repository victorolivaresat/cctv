// pages/History/History.js
import { getYesterdayDate, getTomorrowDate } from "../../utils/DateUtils";
import NewNotifications from "../../components/History/NewNotifications";
import { Row, Col, Spinner, Form, Button, Card } from "react-bootstrap";
import EventTimeline from "../../components/History/EventTimeline";
import EventHistory from "../../components/History/EventHistory";
import { FaSearch, FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getEventSummaryByDateRange,
  getNewNotificationsCountByDate,
  getEventHistoryTimeline,
} from "../../api/events";

const History = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [eventTimeline, setEventTimeline] = useState([]);

  const [startDate, setStartDate] = useState(getYesterdayDate());
  const [endDate, setEndDate] = useState(getTomorrowDate());

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

  const handleDateSubmit = () => {
    fetchEvents(startDate, endDate);
    handleDateChange(startDate, endDate);
    handleEventTimeline(startDate, endDate);
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
    return (
      <div className="mt-4 text-center">
        <span className="bg-danger-subtle px-3 py-2 rounded-3">Sin datos</span>
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
                <Form.Group>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleDateSubmit}
                    className="w-100"
                  >
                    <FaSearch className="me-2" />
                    Consultar
                  </Button>
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
