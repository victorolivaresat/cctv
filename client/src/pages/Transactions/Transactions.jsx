import EventSamsung from "../../components/Events/EventSamsung";
import EventHv from "../../components/Events/EventHv";
import { Tabs, Tab, Card } from "react-bootstrap";
import "./Transactions.css";

const Transactions = () => {
  return (
    <div className="m-4 shadow-sm">
      <Tabs defaultActiveKey="eventHv" id="tab-events">
        <Tab eventKey="eventHv" title="Bcp">
          <Card className="p-5">
            <EventHv />
          </Card>
        </Tab>
        <Tab eventKey="eventSamsung2" title="Interbank">
          <Card className="p-5">
            <EventHv />
          </Card>
        </Tab>
        <Tab eventKey="eventSamsung" title="Bbva">
          <Card className="p-5">
            <EventSamsung />
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Transactions;