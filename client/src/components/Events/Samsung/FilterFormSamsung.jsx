// components/FilterForm.js
import { Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import ExcelExport from "../../../utils/ExcelExport";
import { FaFilter, FaTimes, FaUndo } from "react-icons/fa";
import PropTypes from "prop-types";

const FilterForm = ({
  filterEventName,
  handleEventNameFilterChange,

  filterStatus,
  handleStatusFilterChange,

  filterDateTime,
  handleDateTimeFilterChange,

  filterName,
  handleNameFilterChange,

  selectedStatus,
  handleStatusChange,
  updateStatus,

  data
}) => {
  const onClear = (clearFunc) => {
    clearFunc({ target: { value: "" } });
  };

  return (
    <Row className="d-flex justify-content-between align-items-center bg-body-tertiary p-3 mb-4 rounded-3">
      <Col md={4}>
        <InputGroup className="my-1">
          <Form.Control
            type="text"
            value={filterEventName}
            onChange={handleEventNameFilterChange}
            placeholder="Filtro Evento"
          />
          <InputGroup.Text>
            {filterEventName ? (
              <FaTimes onClick={() => onClear(handleEventNameFilterChange)} />
            ) : (
              <FaFilter />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col md={4}>
        <InputGroup className="my-1">
          <Form.Control
            as="select"
            value={filterStatus}
            onChange={handleStatusFilterChange}
            placeholder="Filter by status"
          >
            <option value="">Filtro Estado</option>
            <option value="new">Nuevo</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
          </Form.Control>
          <InputGroup.Text>
            {filterStatus ? (
              <FaTimes onClick={() => onClear(handleStatusFilterChange)} />
            ) : (
              <FaFilter />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col md={4}>
        <InputGroup className="my-1">
          <Form.Control
            type="date"
            value={filterDateTime}
            onChange={handleDateTimeFilterChange}
            placeholder="Filter by date time"
          />
          <InputGroup.Text>
            {filterDateTime ? (
              <FaTimes onClick={() => onClear(handleDateTimeFilterChange)} />
            ) : (
              <FaFilter />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col md={4}>
        <InputGroup className="my-1">
          <Form.Control
            type="text"
            value={filterName}
            onChange={handleNameFilterChange}
            placeholder="Filtro por Tienda"
          />
          <InputGroup.Text>
            {filterName ? (
              <FaTimes onClick={() => onClear(handleNameFilterChange)} />
            ) : (
              <FaFilter />
            )}
          </InputGroup.Text>
        </InputGroup>
      </Col>
      <Col md={4}>
        <InputGroup className="my-1">
          <Form.Control
            as="select"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value="new">Nuevo</option>
            <option value="pending">Pendiente</option>
            <option value="completed">Completado</option>
          </Form.Control>
          <Button
            size="sm"
            variant="success"
            onClick={() => updateStatus(selectedStatus)}
          >
            <FaUndo className="me-2" />
            Actualizar
          </Button>
        </InputGroup>
      </Col>
      <Col md={4}>
        <ExcelExport data={data} fileName="samsung"/>
      </Col>
    </Row>
  );
};

FilterForm.propTypes = {
  filterEventName: PropTypes.string,
  handleEventNameFilterChange: PropTypes.func,
  filterStatus: PropTypes.string,
  handleStatusFilterChange: PropTypes.func,
  filterDateTime: PropTypes.string,
  handleDateTimeFilterChange: PropTypes.func,
  filterName: PropTypes.string,
  handleNameFilterChange: PropTypes.func,
  selectedStatus: PropTypes.string,
  handleStatusChange: PropTypes.func,
  updateStatus: PropTypes.func,
  data: PropTypes.array,
};

export default FilterForm;
