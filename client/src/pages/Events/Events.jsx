import RemoveDuplicated from "../../components/AlertCctv/RemoveDuplicated";
import { Row, Col, Tabs, Tab, Card, Alert } from "react-bootstrap";
import EventSamsung from "../../components/Events/EventSamsung";
import EventHv from "../../components/Events/EventHv";
import "./Events.css";

const Events = () => {
  return (
    <div className="my-5 mx-3">
      <Tabs defaultActiveKey="eventHv" id="tab-events">
        <Tab eventKey="eventHv" title="Eventos Hikvision">
          <Row className="mt-4">
            <Col lg={2}>
              <Alert variant="info" className="border-0 p-4 shadow">
                <p>
                  Elimina los eventos duplicados de la base de datos de eventos.
                </p>
                <RemoveDuplicated />
              </Alert>
            </Col>
            <Col lg={10}>
              <Card className="p-4 shadow">
                <EventHv />
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="eventSamsung" title="Eventos Samsung">
          <Card className="p-4">
            <EventSamsung />
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Events;
