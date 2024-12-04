import ProcessEmail from "../../components/Email/ProcessEmails";
import { Row, Col, Alert } from "react-bootstrap";

const Email = () => {
  return (
    <Row>
      <Col md="3" className="my-4">
        <ProcessEmail />
      </Col>
      <Col md="9" className="my-4">
        <Alert variant="primary">
          <Alert.Heading>Process Email</Alert.Heading>
          <p>
            This page is for email processing. You can view the emails and
            process them.
          </p>
        </Alert>
      </Col>
    </Row>
  );
};

export default Email;
