// components/FilterForm.js
import { Form, InputGroup, Button } from "react-bootstrap";
import { FaFilter, FaTimes } from "react-icons/fa";
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
}) => {
  const onClear = (clearFunc) => {
    clearFunc({ target: { value: "" } });
  };

  return (
    <Form className="my-3 p-2">
      <InputGroup className="my-2">
        <Form.Control
          type="text"
          value={filterEventName}
          onChange={handleEventNameFilterChange}
          placeholder="Filter event Name"
        />
        <InputGroup.Text>
          {filterEventName ? (
            <FaTimes onClick={() => onClear(handleEventNameFilterChange)} />
          ) : (
            <FaFilter />
          )}
        </InputGroup.Text>
      </InputGroup>
      <InputGroup className="my-2">
        <Form.Control
          type="text"
          value={filterStatus}
          onChange={handleStatusFilterChange}
          placeholder="Filter by status"
        />
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
          Update Status
        </Button>
      </InputGroup>
    </Form>
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
};

export default FilterForm;
