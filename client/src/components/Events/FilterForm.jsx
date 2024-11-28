// components/FilterForm.js
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaFilter, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const FilterForm = ({
  filterDate,
  handleDateFilterChange,
  filterStatus,
  handleStatusFilterChange,
  filterEventType,
  handleEventTypeFilterChange,
  filterName,
  handleNameFilterChange,
  selectedStatus,
  handleStatusChange,
  updateStatus,
}) => {
  const onClear = (clearFunc) => {
    clearFunc({ target: { value: "" } });
  };

  return (
    <Form className="my-3 p-2">
      <InputGroup className="my-2">
        <Form.Control
          type="date"
          value={filterDate}
          onChange={handleDateFilterChange}
          placeholder="Filter by date"
        />
        <InputGroup.Text>
          {filterDate ? (
            <FaTimes onClick={() => onClear(handleDateFilterChange)} />
          ) : (
            <FaFilter />
          )}
        </InputGroup.Text>
      </InputGroup>

      <InputGroup className="my-2">
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



      <InputGroup className="my-2">
        <Form.Control
          type="text"
          value={filterEventType}
          onChange={handleEventTypeFilterChange}
          placeholder="Filter by event type"
        />
        <InputGroup.Text>
          {filterEventType ? (
            <FaTimes onClick={() => onClear(handleEventTypeFilterChange)} />
          ) : (
            <FaFilter />
          )}
        </InputGroup.Text>
      </InputGroup>

      <InputGroup className="my-2">
        <Form.Control
          type="text"
          value={filterName}
          onChange={handleNameFilterChange}
          placeholder="Filter by name"
        />
        <InputGroup.Text>
          {filterName ? (
            <FaTimes onClick={() => onClear(handleNameFilterChange)} />
          ) : (
            <FaFilter />
          )}
        </InputGroup.Text>
      </InputGroup>
      <InputGroup className="my-2">
        <Form.Control
          as="select"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Form.Control>
        <Button
          size="sm"
          variant="success"
          onClick={() => updateStatus(selectedStatus)}
        >
          Actualizar Estado
        </Button>
      </InputGroup>
    </Form>
  );
};

FilterForm.propTypes = {
  filterDate: PropTypes.string,
  handleDateFilterChange: PropTypes.func,
  filterStatus: PropTypes.string,
  handleStatusFilterChange: PropTypes.func,
  filterEventType: PropTypes.string,
  handleEventTypeFilterChange: PropTypes.func,
  filterName: PropTypes.string,
  handleNameFilterChange: PropTypes.func,
  selectedStatus: PropTypes.string,
  handleStatusChange: PropTypes.func,
  updateStatus: PropTypes.func,
};

export default FilterForm;
