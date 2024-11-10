import { FaVideo, FaClock, FaCheck, FaCalendar } from "react-icons/fa";
import DarkModeContext from "../../contexts/DarkModeContext";
import logoSamsung from "../../assets/img/samsung.png";
import logoDarkSamsung from "../../assets/img/samsung_dark.png";
import { Row, Col, Card, Form } from "react-bootstrap";
import { lastEventsSamsung } from "../../api/events";
import { formatDate } from "../../utils/DateUtils";
import { useEffect, useState, useContext } from "react";

const CardEventSamsung = () => {
  const [eventsData, setEventsData] = useState([]);
  const [eventLimit, setEventLimit] = useState(2);
  const darkMode = useContext(DarkModeContext);

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
            className="float-end mt-2"
            src={darkMode ? logoDarkSamsung : logoSamsung}
            alt="Hikvision"
            width="100"
          />
          <h4 className="text-primary-emphasis">Events Samsung</h4>
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
                <option value="6">6</option>
                <option value="8">8</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Col>

        {eventsData.map((event, index) => (
          <Col key={index} lg={6} md={12}>
            <Card className="mb-4 shadow bg-blue text-bg-primary p-2">
              <Card.Body>
                <Card.Title className="bg-light text-primary px-3 mb-4 py-2 rounded-3 ">
                  <FaCheck /> &nbsp;
                  {event.name}
                </Card.Title>
                {event.eventName && (
                  <div className="px-2">
                    <div className="mb-3">
                      <FaVideo /> &nbsp; Eventname:
                    </div>
                    {Object.entries(JSON.parse(event.eventName)).map(
                      ([key, value]) => (
                        <pre key={key} className="blink">
                          <span>{key} </span>
                          {value}
                        </pre>
                      )
                    )}
                  </div>
                )}
                <Card.Text className="px-2">
                  <FaClock /> &nbsp; Date: &nbsp;
                  {formatDate(event.dateTime)}
                </Card.Text>
                <Card.Text className="px-2">
                  <FaCalendar /> &nbsp; Date: &nbsp;
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

export default CardEventSamsung;
