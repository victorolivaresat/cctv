
import ProcessEmail from "../../components/Email/ProcessEmails";
import { Row, Col, Alert } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

const Email = () => {

  return (
    <Row>
      <Col md="3" className="my-4">
        <ProcessEmail />
      </Col>
      <Col md="9" className="my-4">
        <Alert variant="info">
          <Alert.Heading>
            <FaInfoCircle className="me-2" />
            ¿Cómo funciona el procesamiento de correos?
          </Alert.Heading>
          <p>
            Este sistema permite procesar correos electrónicos relacionados con notificaciones
            de desconexión de dispositivos Hikvision y Samsung. Los correos en la carpeta
            <strong> INBOX</strong> son analizados para identificar eventos críticos y generar
            reportes o alertas según la configuración seleccionada.
          </p>
          <hr />
          <p className="mb-0">
            Configura las fechas, selecciona la marca y ejecuta el procesamiento. El sistema
            procesará automáticamente los correos de la fecha seleccionada y mostrará los
            resultados o cualquier error encontrado.
          </p>
        </Alert>
      </Col>
    </Row>
  );
};

export default Email;
