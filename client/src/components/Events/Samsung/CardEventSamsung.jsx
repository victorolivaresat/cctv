import { FaVideo, FaClock, FaCheck, FaCalendar } from "react-icons/fa";
import logoDarkSamsung from "../../../assets/img/samsung_dark.png";
import logoSamsung from "../../../assets/img/samsung.png";
import { Row, Col, Card, Form } from "react-bootstrap";
import { lastEventsSamsung } from "../../../api/events";
import { formatDate } from "../../../utils/DateUtils";
import useDarkMode from "../../../hooks/useDarkMode";
import { useEffect, useState } from "react";

const CardEventSamsung = () => {
  const [eventsData, setEventsData] = useState([]);
  const [eventLimit, setEventLimit] = useState(2);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const data = await lastEventsSamsung(eventLimit);
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, [eventLimit]);

  const handleLimitChange = (e) => {
    setEventLimit(e.target.value);
  };

  return (
    <>
      <Row>
        <div className="mb-1">
          <img
            className="mt-2"
            src={darkMode ? logoDarkSamsung : logoSamsung}
            alt="Hikvision"
            width="120"
          />
        </div>

        <Col md={12} className="mb-3">
          <Form.Group as={Row}>
            <Form.Label column sm={6} md={6} lg={6}>
              Number of Events to Display:
            </Form.Label>
            <Col sm={6} md={6} lg={6}>
              <Form.Select
                value={eventLimit}
                onChange={handleLimitChange}
                id="select-samsung"
              >
                <option value="2">2</option>
                <option value="4">4</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>

        {eventsData.map((event, index) => (
          <Col key={index} lg={6} md={12}>
            <Card className="mb-4 shadow bg-blue text-bg-primary p-2">
              <Card.Body>
                <Card.Title className="fs-6 bg-light text-primary px-3 mb-4 py-2 rounded-3 ">
                  <FaCheck size={15} /> &nbsp;
                  {event.name}
                </Card.Title>
                {event.event_name && (
                  <div className="px-2">
                    <div className="mb-1">
                      <FaVideo /> &nbsp; Event name:
                    </div>
                    <div className="event-details">
                      <pre className="blink">
                        <span></span>
                        {event.event_name}
                      </pre>
                    </div>
                  </div>
                )}

                <Card.Text className="mt-3 px-2">
                  <FaClock /> &nbsp;Event Time DVR: &nbsp;
                  {formatDate(event.event_time)}
                </Card.Text>
                <Card.Text className="px-2">
                  <FaCalendar /> &nbsp;Created Date: &nbsp;
                  {formatDate(event.created_at)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CardEventSamsung;
