import { FaVideo, FaCamera, FaClock, FaCheck, FaCalendar } from "react-icons/fa";
import DarkModeContext from "../../contexts/DarkModeContext";
import logoHikvision from "../../assets/img/hikvision.png";
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import { Row, Col, Card, Form } from "react-bootstrap";
import { formatDate } from "../../utils/DateUtils";
import { lastEventsHv } from "../../api/events";
import { useEffect, useState, useContext } from "react";

const CardEventHv = () => {
  const [eventsData, setEventsData] = useState([]);
  const [eventLimit, setEventLimit] = useState(2);
  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const data = await lastEventsHv(eventLimit);
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
            className="float-end mt-2"
            src={ darkMode ? logoDarkHv : logoHikvision}
            alt="Hikvision"
            width="100"
          />
          <h4 className="text-primary-emphasis">Events Hikvision</h4>
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
                id="select-hikvision"
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>

        {eventsData.map((event, index) => (
          <Col key={index} lg={6} md={12}>
            <Card className="mb-4 shadow p-2">
              <Card.Body>
                <Card.Title className="card-title bg-secondary text-bg-secondary px-3 mb-4 py-2 rounded-3 ">
                  <FaCheck /> &nbsp;
                  {event.name}
                </Card.Title>
                <Card.Text className="card-text text-primary px-2 fs-6 blink">
                  <FaVideo /> &nbsp; Event Type: &nbsp;
                  {event.eventType}
                </Card.Text>
                {event.cameraName && (
                  <pre>
                    <Card.Text className="card-text text-success px-2 fs-6">
                      <FaCamera /> &nbsp; Camera Name: &nbsp;
                      {event.cameraName}
                    </Card.Text>
                  </pre>
                )}
                <Card.Text className="card-text px-2 fs-6 ">
                  <FaClock /> &nbsp; Event Time: &nbsp;
                  {formatDate(event.eventTime)}
                </Card.Text>
                <Card.Text className="card-text text-info px-2 fs-6 ">
                  <FaCalendar /> &nbsp; Created Date: &nbsp;
                  {formatDate(event.createdAt)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CardEventHv;
