import { FaEye, FaComment, FaTimes, FaFilter, FaUndo } from "react-icons/fa";
import { Alert, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { MdApps, MdVideocam, MdCheck, MdCircle } from "react-icons/md";
import RemoveDuplicate from "./RemoveDuplicate";
import ObservationModal from "../ObservationsModal";
import ExcelExport from "../../../utils/ExcelExport";
import DataTableBase from "../../../utils/DataTable";
import useDarkMode from "../../../hooks/useDarkMode";
import { useEffect, useState } from "react";
import DetailSamsung from "./DetailSamsung";
import PropTypes from "prop-types";
import {
  eventsSamsung,
  distinctNameSamsungCount,
  updateEventSamsungStatus,
  updateAddObservationsSamsung,
} from "../../../api/events";
import {
  formatDate,
  formatDateInput,
  getTomorrowDate,
  getYesterdayDate,
  validateDateRange,
} from "../../../utils/DateUtils";

import logoDarkSamsung from "../../../assets/img/samsung_dark.png";
import logoSamsung from "../../../assets/img/samsung.png";

const EventSamsung = () => {
  const [startDate, setStartDate] = useState(formatDateInput(getYesterdayDate()));
  const [endDate, setEndDate] = useState(formatDateInput(getTomorrowDate()));
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [currentObservation, setCurrentObservation] = useState("");
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [filterEventName, setFilterEventName] = useState("");
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [testsCountData, setTestsCountData] = useState(0);
  const [currentDetail, setCurrentDetail] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const { darkMode } = useDarkMode();

  useEffect(() => {
    handleFetchTestsCount();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleFetchEvents(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleFetchTestsCount = async () => {
    try {
      const data = await distinctNameSamsungCount();
      setTestsCountData(data);
      console.log("Tests count data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSamsungDetails = async (row) => {
    setShowModalDetail(true);
    setCurrentDetail(row);
  };

  const handleFetchEvents = async (startDate, endDate) => {
    try {
      if (new Date(startDate) > new Date(endDate)) {
        alert("La fecha de inicio no puede ser mayor a la fecha final");
        return;
      }

      if (!validateDateRange(startDate, endDate)) {
        alert("El rango de fechas no puede ser mayor a 60 días");
        return;
      }

      const data = await eventsSamsung(startDate, endDate);
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (filterFunction) => (e) => {
    filterFunction(e.target.value);
    console.log(e.target.value);
  };

  const handleCloseModalDetail = () => setShowModalDetail(false);

  const handleNameFilterChange = handleFilterChange(setFilterName);
  const handleStatusFilterChange = handleFilterChange(setFilterStatus);
  const handleEventNameFilterChange = handleFilterChange(setFilterEventName);

  const filteredEventsData = eventsData.filter((event) => {
    const filterNameLower = filterName.toLowerCase();
    const filterEventNameLower = filterEventName.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();

    const eventNameLower = event.name.toLowerCase();
    const eventEventNameLower = event.event_name.toLowerCase();
    const eventStatusLower = event.status.toLowerCase();

    return (
      (filterNameLower ? eventNameLower.includes(filterNameLower) : true) &&
      (filterEventNameLower ? eventEventNameLower.includes(filterEventNameLower) : true) &&
      (filterStatusLower ? eventStatusLower.includes(filterStatusLower) : true)
    );
  });

  const getStatusName = (status) => {
    const statusNames = {
      new: "Nuevo",
      pending: "Pendiente",
      completed: "Completado",
    };
    return statusNames[status];
  };

    // Funciones de actualización
    const handleClearRows = () => {
      setToggleClearRows(!toggledClearRows);
    };

  const columns = [
    {
      cell: () => <MdApps style={{ fill: "#43a047" }} />,
      width: "50px",
      style: {
        marginBottom: "-1px",
      },
    },
    {
      name: "Nombre Tienda",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "200px",
      maxWidth: "250px",
    },
    {
      name: "Nombre Evento",
      selector: (row) => row.event_name,
      cell: (row) => {
        const eventNameParts = row.event_name.split(":");
        return eventNameParts[0];
      },
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Fecha Dvr",
      selector: (row) => formatDate(row.event_time),
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Fecha Creacion",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Estado",
      cell: (row) => getStatusName(row.status),
      conditionalCellStyles: [
        { when: (row) => row.status === "new", classNames: ["status-new"] },
        { when: (row) => row.status === "pending", classNames: ["status-pending"] },
        { when: (row) => row.status === "completed", classNames: ["status-completed"] },
      ],
      sortable: true,
      minWidth: "50px",
      maxWidth: "120px",
    },
    {
      name: "",
      cell: (row) => (
        <>
          <a
            href="#!"
            className="me-2 py-1 px-2 bg-secondary-subtle rounded-3"
            onClick={() => handleShowModal(row)}
          >
            <FaComment className={row.observations ? "text-warning" : "text-primary"} />
          </a>
          <a
            href="#!"
            className="me-2 py-1 px-2 bg-danger-subtle rounded-3"
            onClick={() => getSamsungDetails(row)}
          >
            <FaEye className="text-danger" />
          </a>
        </>
      ),
      sortable: true,
      minWidth: "50px",
      maxWidth: "80px",
    },
  ];

  const ExpandedComponent = ({ data }) => {
    return (
      <Alert className="mx-4 my-2 border-0 shadow-sm" variant="info" style={{ whiteSpace: "pre-line" }}>
        <h6>
          <MdVideocam className="me-2" />
          Event Name
        </h6>
        <pre>
          <MdCheck className="me-2" />
          {data.event_name}
        </pre>
      </Alert>
    );
  };

  const handleShowModal = (row) => {
    setSelectedRow(row);
    setCurrentObservation(row.observations);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSaveObservation = async (updatedObservation) => {
    if (selectedRow) {
      console.log("Saving observation:", updatedObservation);
      console.log("Selected row ID:", selectedRow.id);
      try {
        await updateAddObservationsSamsung(selectedRow.id, updatedObservation);
        handleFetchEvents(startDate, endDate);
        handleCloseModal();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleRowSelection = ({ selectedRows }) => {
    setSelectedRowsId(selectedRows.map((row) => row.id));
    console.log("Selected rows:", selectedRows.map((row) => row.id));
  };

  const updateStatus = async (status) => {
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) => updateEventSamsungStatus(id, status))
      );
      handleFetchEvents(startDate, endDate);
      handleClearRows();
      console.log("Status updated:", data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Row className="p-4">
      <Col md="2" className="p-4 bg-primary-subtle rounded-3">
        <div>
          <img
            className="mb-3"
            src={darkMode ? logoDarkSamsung : logoSamsung}
            alt="Samsung"
            width="120"
          />
        </div>
        <div>
          <h6 className="my-3 small">
            <MdCircle className="text-success" />
            &nbsp; Connected DVR: {testsCountData}
          </h6>
        </div>

        <hr className="mb-3" />

        <RemoveDuplicate />
      </Col>
      <Col md="10" className="px-4">
        <Row className="d-flex justify-content-between align-items-center bg-body-tertiary p-3 mb-4 rounded-3">
          <Col md={6}>
            <InputGroup className="my-1">
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Fecha inicial"
              />
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Fecha final"
              />
              <InputGroup.Text>
                {startDate || endDate ? (
                  <FaTimes
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
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
                <option value="">Estado</option>
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
            <ExcelExport data={filteredEventsData} fileName="samsung" />
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
                placeholder="Tienda"
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
                value={filterEventName}
                onChange={handleEventNameFilterChange}
                placeholder="Evento"
              />
              <InputGroup.Text>
                {filterEventName ? (
                  <FaTimes
                    onClick={() =>
                      handleEventNameFilterChange({ target: { value: "" } })
                    }
                  />
                ) : (
                  <FaFilter />
                )}
              </InputGroup.Text>
            </InputGroup>
          </Col>
        </Row>

        <DataTableBase
          columns={columns}
          data={filteredEventsData}
          paginationPerPage={10}
          expandableRowsComponent={ExpandedComponent}
          expandableRows
          selectableRows
          onSelectedRowsChange={handleRowSelection}
          clearSelectedRows={toggledClearRows}
        />
      </Col>
      <ObservationModal
        show={showModal}
        handleClose={handleCloseModal}
        observation={currentObservation}
        setObservation={setCurrentObservation}
        handleSave={handleSaveObservation}
      />
      <DetailSamsung
        show={showModalDetail}
        handleClose={handleCloseModalDetail}
        detail={currentDetail}
      />
    </Row>
  );
};

EventSamsung.propTypes = {
  data: PropTypes.array,
};

export default EventSamsung;