import { Form, InputGroup } from "react-bootstrap";
import { FaFilter, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import ExcelExport from "../../utils/ExcelExport";

const FilterForm = ({
  filterStartDate,
  filterEndDate,
  filterStatus,
  filterEventType,
  filterName,
  handleStartDateFilterChange,
  handleEndDateFilterChange,
  handleStatusFilterChange,
  handleEventTypeFilterChange,
  handleNameFilterChange,
}) => {
  return (
    <Row className="d-flex justify-content-between align-items-center bg-body-tertiary p-3 mb-4 rounded-3">
          <Row className="d-flex justify-content-between align-items-center bg-body-tertiary p-3 mb-4 rounded-3">
          <Col md={6}>
            <InputGroup className="my-1">
              <Form.Control
                type="date"
                value={filterStartDate}
                onChange={handleStartDateFilterChange}
                placeholder="Fecha inicial"
              />
              <Form.Control
                type="date"
                value={filterEndDate}
                onChange={handleEndDateFilterChange}
                placeholder="Fecha final"
              />
              <InputGroup.Text>
                {filterStartDate || filterEndDate ? (
                  <FaTimes
                    onClick={() => {
                      handleStartDateFilterChange({ target: { value: "" } });
                      handleEndDateFilterChange({ target: { value: "" } });
                    }}
                  />
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
                  <FaTimes
                    onClick={() =>
                      handleStatusFilterChange({ target: { value: "" } })
                    }
                  />
                ) : (
                  <FaFilter />
                )}
              </InputGroup.Text>
            </InputGroup>
          </Col>

          <Col md={2}>
            <ExcelExport data={filteredEventsData} fileName="hikvision" />
          </Col>

          <Col md={4}>
            <InputGroup className="my-1">
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="" disabled>
                  Elegir un Estado
                </option>
                <option value="new">Nuevo</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
              </Form.Control>
              <Button
                size="sm"
                variant="success"
                onClick={() => updateStatus(selectedStatus)}
                className="ml-2"
              >
                <FaUndo className="me-2" />
                Actualizar
              </Button>
            </InputGroup>
          </Col>

          <Col md={4}>
            <InputGroup className="my-1">
              <Form.Control
                type="text"
                value={filterName}
                onChange={handleNameFilterChange}
                placeholder="Filtro Nombre Tienda"
              />
              <InputGroup.Text>
                {filterName ? (
                  <FaTimes
                    onClick={() =>
                      handleNameFilterChange({ target: { value: "" } })
                    }
                  />
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
                value={filterEventType}
                onChange={handleEventTypeFilterChange}
                placeholder="Filtro Tipo Evento"
              />
              <InputGroup.Text>
                {filterEventType ? (
                  <FaTimes
                    onClick={() =>
                      handleEventTypeFilterChange({ target: { value: "" } })
                    }
                  />
                ) : (
                  <FaFilter />
                )}
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>
    </Row>
  );
};

FilterForm.propTypes = {
  filterStartDate: PropTypes.string,
  filterEndDate: PropTypes.string,
  filterStatus: PropTypes.string,
  filterEventType: PropTypes.string,
  filterName: PropTypes.string,
  handleStartDateFilterChange: PropTypes.func,
  handleEndDateFilterChange: PropTypes.func,
  handleStatusFilterChange: PropTypes.func,
  handleEventTypeFilterChange: PropTypes.func,
  handleNameFilterChange: PropTypes.func,
  onClear: PropTypes.func,
};

export default FilterForm;
