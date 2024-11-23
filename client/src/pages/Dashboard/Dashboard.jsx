import ChartSamsungEvent from "../../components/Events/ChartSamsungEvent";
import CardEventSamsung from "../../components/Events/CardEventSamsung";
import ChartHvEvent from "../../components/Events/ChartHvEvent";
import CardEventHv from "../../components/Events/CardEventHv";
import { Row, Col } from "react-bootstrap";
import "./Dashboard.css";

const Dashboard = () => {

  return (
    <>
      <Row className="my-3 mx-2">
        <Col lg={6}>
          <CardEventHv />
        </Col>
        <Col lg={6}>
          <CardEventSamsung />
        </Col>
      </Row>
      <Row className="my-3 mx-2">
        <Col lg={6} className="mb-3">
          <ChartHvEvent />
        </Col>
        <Col lg={6}>
          <ChartSamsungEvent className="mb-3" />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
