// pages/History/History.js

import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import NewNotifications from "../../components/History/NewNotifications";
import EventHistory from "../../components/History/EventHistory";
import EventTimeline from "../../components/History/EventTimeline";
import {
  getEventSummaryByDateRange,
  getNewNotificationsCountByDate,
  getEventHistoryTimeline,
} from "../../api/events";
import { getYesterdayDate, getTomorrowDate } from "../../utils/DateUtils";

const History = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [ eventTimeline, setEventTimeline ] = useState([]);

  useEffect(() => {
    const startDate = getYesterdayDate();
    const endDate = getTomorrowDate();
    fetchEvents(startDate, endDate);
    handleDateChange(startDate, endDate);
    handleEventTimeline(startDate, endDate);
  }, []);

  const fetchEvents = async (startDate, endDate) => {
    try {
      const result = await getEventSummaryByDateRange(startDate, endDate);
      setEvents(result);
      console.log(result);
    } catch (err) {
      setError("Error al cargar los eventos");
      toast.error("Error al cargar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (startDate, endDate) => {
    try {
      setLoading(true);
      const result = await getNewNotificationsCountByDate(startDate, endDate);
      setNotifications(result);
      console.log(result);
    } catch (err) {
      setError("Error al cargar las notificaciones");
      toast.error("Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEventTimeline = async (startDate, endDate) => {
    try {
      setLoading(true);
      const result = await getEventHistoryTimeline(startDate, endDate);
      setEventTimeline(result);
      console.log(result);
    } catch (err) {
      setError("Error al cargar el historial de eventos");
      toast.error("Error al cargar el historial de eventos");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <Alert variant="danger">
          <FaExclamationCircle className="me-2" />
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Row className="g-3 mt-2">
        {/* Columna de Notificaciones */}
        <Col sm={12} md={4} lg={3}>
          <NewNotifications notifications={notifications} />
          <EventHistory events={events} />
        </Col>

        {/* Columna de Eventos */}
        <Col sm={12} md={8} lg={9}>
          <EventTimeline events={eventTimeline} />
        </Col>
      </Row>
    </div>
  );
};

export default History;
