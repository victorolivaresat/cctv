import { Tab, Row, Col, Nav, Card } from 'react-bootstrap';
import EventSamsung from "../../components/Events/EventSamsung";
import EventHv from "../../components/Events/EventHv";
import "./Events.css";

const Events = () => {
  return (
    <Tab.Container defaultActiveKey="eventHv">
      <Row className='my-4'>
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="eventHv">Eventos Hikvision</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="eventSamsung">Eventos Samsung</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="eventHv">
              <Card className="p-4 shadow">
                <EventHv />
              </Card>
            </Tab.Pane>
            <Tab.Pane eventKey="eventSamsung">
              <Card className="p-4">
                <EventSamsung />
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Events;