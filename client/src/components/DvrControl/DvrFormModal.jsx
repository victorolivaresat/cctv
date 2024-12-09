import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  FaCheck,
  FaStore,
  FaBuilding,
  FaCogs,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaTimes,
  FaStickyNote,
} from "react-icons/fa";
import PropTypes from "prop-types";

const DvrFormModal = ({ show, onHide, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    store_name: "",
    company_name: "",
    dvr_name: "",
    notification_email_in: "",
    notification_email_out: "",
    remote_connection_tool: "",
    remote_connection_id: "",
    notes: [],
    supervisor_name: "",
    supervisor_phone: "",
    supervisor_area_manager: "",
    supervisor_zone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      console.log(initialData);

      let supervisorData = initialData.supervisor;
      if (typeof supervisorData === "string") {
        supervisorData = JSON.parse(supervisorData);
      }

      let notesData = [];
      try {
        notesData = JSON.parse(initialData.notes) || [];
        if (!Array.isArray(notesData)) {
          notesData = [];
        }
      } catch (e) {
        notesData = [];
      }

      setFormData({
        store_name: initialData.store_name || "",
        company_name: initialData.company_name || "",
        dvr_name: initialData.dvr_name || "",
        notification_email_in: initialData.notification_email_in || "",
        notification_email_out: initialData.notification_email_out || "",
        remote_connection_tool: initialData.remote_connection_tool || "",
        remote_connection_id: initialData.remote_connection_id || "",
        notes: notesData,
        supervisor_name: supervisorData.name || "",
        supervisor_phone: supervisorData.phone || "",
        supervisor_area_manager: supervisorData.area_manager || "",
        supervisor_zone: supervisorData.zone || "",
      });
    } else {
      setFormData({
        store_name: "",
        company_name: "",
        dvr_name: "",
        notification_email_in: "",
        notification_email_out: "",
        remote_connection_tool: "",
        remote_connection_id: "",
        notes: [],
        supervisor_name: "",
        supervisor_phone: "",
        supervisor_area_manager: "",
        supervisor_zone: "",
      });
    }
  }, [initialData, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.store_name) {
      newErrors.store_name = "Store name is required";
    }

    if (!formData.company_name) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.dvr_name) {
      newErrors.dvr_name = "DVR name is required";
    }

    if (!formData.notification_email_in) {
      newErrors.notification_email_in = "Notification email (in) is required";
    }

    if (!formData.notification_email_out) {
      newErrors.notification_email_out = "Notification email (out) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const supervisor = {
        name: formData.supervisor_name,
        phone: formData.supervisor_phone,
        area_manager: formData.supervisor_area_manager,
        zone: formData.supervisor_zone,
      };

      const flattenedFormData = {
        ...formData,
        notes: JSON.stringify(formData.notes),
        supervisor,
      };

      delete flattenedFormData.supervisor_name;
      delete flattenedFormData.supervisor_phone;
      delete flattenedFormData.supervisor_area_manager;
      delete flattenedFormData.supervisor_zone;

      console.log(flattenedFormData);

      onSubmit(flattenedFormData);
    }
  };

  const handleAddNote = () => {
    setFormData({
      ...formData,
      notes: [...formData.notes, ""],
    });
  };

  const handleUpdateNote = (index, value) => {
    const updatedNotes = [...formData.notes];
    updatedNotes[index] = value;
    setFormData({
      ...formData,
      notes: updatedNotes,
    });
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = formData.notes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      notes: updatedNotes,
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Editar Registro" : "Crear Registro"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* First column */}
            <Col md={6}>
              <Form.Group controlId="formStoreName" className="mb-3">
                <Form.Label>Tienda</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaStore />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="store_name"
                    value={formData.store_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.store_name}
                    required
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.store_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formCompanyName" className="mb-3">
                <Form.Label>Empresa</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaBuilding />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Empresa</option>
                    <option value="Free Games">Free Games</option>
                    <option value="IGH">IGH</option>
                  </Form.Control>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.company_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formDvrName" className="mb-3">
                <Form.Label>DVR (Marca)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaCogs />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="dvr_name"
                    value={formData.dvr_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.dvr_name}
                    required
                  >
                    <option value="">DVR (Marca)</option>
                    <option value="HIKVISION">Hikvision</option>
                    <option value="SAMSUNG">Samsung</option>
                    <option value="DAHUA">Dahua</option>
                    <option value="Otros">Otros</option>
                  </Form.Control>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.dvr_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formNotes" className="mb-3">
                <Form.Label>Notas</Form.Label>
                {formData.notes.map((note, index) => (
                  <InputGroup className="mb-2" key={index}>
                    <Form.Control
                      type="text"
                      value={note}
                      onChange={(e) => handleUpdateNote(index, e.target.value)}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteNote(index)}
                    >
                      <FaTimes />
                    </Button>
                  </InputGroup>
                ))}
                <Button className="w-100" variant="success" size="sm" onClick={handleAddNote}>

                  <FaStickyNote className="me-2" />
                  Agregar Nota
                </Button>
              </Form.Group>
            </Col>

            {/* Second column */}
            <Col md={6}>
              <Form.Group controlId="formNotificationEmailIn" className="mb-3">
                <Form.Label>Correo de notificación (entrada)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="notification_email_in"
                    value={formData.notification_email_in}
                    onChange={handleInputChange}
                    isInvalid={!!errors.notification_email_in}
                    required
                  >
                    <option value="">Correo de entrada</option>
                    <option value="at.alertas@gmail.com">
                      at.alertas@gmail.com
                    </option>
                    <option value="notificaciones.cctv@apuestatotal.net">
                      notificaciones.cctv@apuestatotal.net
                    </option>
                  </Form.Control>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.notification_email_in}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formNotificationEmailOut" className="mb-3">
                <Form.Label>Correo de notificación (salida)</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaEnvelope />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="notification_email_out"
                    value={formData.notification_email_out}
                    onChange={handleInputChange}
                    isInvalid={!!errors.notification_email_out}
                    required
                  >
                    <option value="">Correo de salida</option>
                    <optgroup label="Correos Free Games">
                      <option value="alertscctv.fg1@gmail.com">
                        alertscctv.fg1@gmail.com
                      </option>
                      <option value="alertscctv.fg2@gmail.com">
                        alertscctv.fg2@gmail.com
                      </option>
                      <option value="alertscctv.fg3@gmail.com">
                        alertscctv.fg3@gmail.com
                      </option>
                      <option value="alertscctv.fg4@gmail.com">
                        alertscctv.fg4@gmail.com
                      </option>
                      <option value="alertscctv.fg5@gmail.com">
                        alertscctv.fg5@gmail.com
                      </option>
                      <option value="alertscctv.fg6@gmail.com">
                        alertscctv.fg6@gmail.com
                      </option>
                    </optgroup>
                    <optgroup label="Correos IGH">
                      <option value="alertscctv.igh1@gmail.com">
                        alertscctv.igh1@gmail.com
                      </option>
                      <option value="alertscctv.igh2@gmail.com">
                        alertscctv.igh2@gmail.com
                      </option>
                      <option value="alertscctv.igh3@gmail.com">
                        alertscctv.igh3@gmail.com
                      </option>
                      <option value="alertscctv.igh4@gmail.com">
                        alertscctv.igh4@gmail.com
                      </option>
                    </optgroup>
                  </Form.Control>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.notification_email_out}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formRemoteConnectionTool" className="mb-3">
                <Form.Label>Conexión Remota</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaCogs />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    name="remote_connection_tool"
                    value={formData.remote_connection_tool}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="TeamViewer">TeamViewer</option>
                    <option value="AnyDesk">AnyDesk</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="formRemoteConnectionId" className="mb-3">
                <Form.Label>ID de conexión remota</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaCogs />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="remote_connection_id"
                    value={formData.remote_connection_id}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Supervisor section */}
            <Col md={12}>
              <Card className="mb-3 bg-body-tertiary">
                <Card.Body>
                  <Card.Title>Supervisor</Card.Title>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        controlId="formSupervisorName"
                        className="mb-3"
                      >
                        <Form.Label>Nombre</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaUser />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="supervisor_name"
                            value={formData.supervisor_name}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group
                        controlId="formSupervisorPhone"
                        className="mb-3"
                      >
                        <Form.Label>Telefono</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaPhone />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="supervisor_phone"
                            value={formData.supervisor_phone}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        controlId="formSupervisorAreaManager"
                        className="mb-3"
                      >
                        <Form.Label>Jefe Comercial</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaMapMarkerAlt />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="supervisor_area_manager"
                            value={formData.supervisor_area_manager}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>

                      <Form.Group
                        controlId="formSupervisorZone"
                        className="mb-3"
                      >
                        <Form.Label>Zona</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FaMapMarkerAlt />
                          </InputGroup.Text>
                          <Form.Control
                            type="text"
                            name="supervisor_zone"
                            value={formData.supervisor_zone}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Button
            className="float-end"
            size="sm"
            variant={initialData ? "warning" : "primary"}
            type="submit"
          >
            <FaCheck className="me-2" />
            {initialData ? "Actualizar Registro" : "Crear Registro"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

DvrFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default DvrFormModal;
