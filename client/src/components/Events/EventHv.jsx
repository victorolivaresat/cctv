import {
  formatDate,
  getTomorrowDate,
  getYesterdayDate,
  formatDateInput,
} from "../../utils/DateUtils";
import { Button, Form, InputGroup, Col, Row, Alert } from "react-bootstrap";
import { FaEye, FaFilter, FaTimes, FaUndo } from "react-icons/fa";
import ExcelExport from "../../utils/ExcelExport";
import useDarkMode from "../../hooks/useDarkMode";
import DataTableBase from "../../utils/DataTable";
import ObservationModal from "./ObservationsModal";
import { MdApps, MdCircle } from "react-icons/md";
import DetailHikvision from "./DetailHikvision";
import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  eventsHv,
  distinctNameHvCount,
  updateEventHvStatus,
  updateAddObservations,
  deleteDuplicateEventsHv,
  getEventHvDetail,
} from "../../api/events";

// Iconos y recursos
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";

import ProcessEmails from "./ProcessEmails";

const EventHv = () => {
  // Estados
  const [currentObservation, setCurrentObservation] = useState(null);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [currentDetail, setCurrentDetail] = useState({});
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [showModalObs, setShowModalObs] = useState(false);
  const [testsCountData, setTestsCountData] = useState(0);
  const [selectedRow, setSelectedRow] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { darkMode } = useDarkMode();

  let yesterday = getYesterdayDate();
  let tomorrow = getTomorrowDate();

  // Filtros
  const [filterEventType, setFilterEventType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState(formatDateInput(yesterday));
  const [filterEndDate, setFilterEndDate] = useState(formatDateInput(tomorrow));
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");



  useEffect(() => {
    handleFetchEvents();
    handleFetchTestsCount();
  }, []);

  const handleFetchEvents = async () => {
    try {
      const data = await eventsHv();
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFetchTestsCount = async () => {
    try {
      const data = await distinctNameHvCount();
      setTestsCountData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (filterFunction) => (e) => {
    filterFunction(e.target.value);
    console.log(e.target.value);
  };

  const handleStartDateFilterChange = handleFilterChange(setFilterStartDate);
  const handleEndDateFilterChange = handleFilterChange(setFilterEndDate);
  const handleStatusFilterChange = handleFilterChange(setFilterStatus);
  const handleEventTypeFilterChange = handleFilterChange(setFilterEventType);
  const handleNameFilterChange = handleFilterChange(setFilterName);

  const filteredEventsData = eventsData.filter((event) => {
    const filterEventTypeLower = filterEventType.toLowerCase();
    const eventTypeLower = event.event_type.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterNameLower = filterName.toLowerCase();
    const statusLower = event.status.toLowerCase();
    const eventDate = new Date(event.event_time);
    const startDate = new Date(filterStartDate);
    const nameLower = event.name.toLowerCase();
    const endDate = new Date(filterEndDate);

    return (
      (!filterStartDate || eventDate >= startDate) &&
      (!filterEndDate || eventDate <= endDate) &&
      (filterStatusLower ? statusLower.includes(filterStatusLower) : true) &&
      (filterEventTypeLower
        ? eventTypeLower.includes(filterEventTypeLower)
        : true) &&
      (filterNameLower ? nameLower.includes(filterNameLower) : true)
    );
  });

  const getEventHvDetails = async (id) => {
    try {
      const data = await getEventHvDetail(id);
      setShowModalDetail(true);
      setCurrentDetail(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatusName = (status) => {
    const statusNames = {
      new: "Nuevo",
      pending: "Pendiente",
      completed: "Completado",
    };
    return statusNames[status];
  };

  const columns = [
    {
      cell: () => <MdApps style={{ fill: "#43a047" }} />,
      width: "50px",
      style: { marginBottom: "-1px" },
    },
    {
      name: "Nombre Tienda",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Evento",
      selector: (row) => row.event_type,
      sortable: true,
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Camara(s)",
      selector: (row) =>
        row.camera_name
          ? row.camera_name === "null"
            ? "-"
            : row.camera_name
          : "-",
      minWidth: "150px",
      maxWidth: "200px",
    },
    {
      name: "Fecha Evento(DVR)",
      selector: (row) => formatDate(row.event_time),
      sortable: true,
      minWidth: "150px",
      maxWidth: "180px",
    },
    {
      name: "Fecha de Creación",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
      minWidth: "150px",
      maxWidth: "180px",
    },
    {
      name: "Estado",
      cell: (row) => getStatusName(row.status),
      conditionalCellStyles: [
        { when: (row) => row.status === "new", classNames: ["status-new"] },
        {
          when: (row) => row.status === "pending",
          classNames: ["status-pending"],
        },
        {
          when: (row) => row.status === "completed",
          classNames: ["status-completed"],
        },
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
            <FaComment
              className={row.observations ? "text-warning" : "text-primary"}
            />
          </a>
          <a
            href="#!"
            className="me-2 py-1 px-2 bg-danger-subtle rounded-3"
            onClick={() => getEventHvDetails(row.id)}
          >
            <FaEye />
          </a>
        </>
      ),
      sortable: true,
      minWidth: "50px",
      maxWidth: "80px",
    },
  ];

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleRowSelection = ({ selectedRows }) => {
    setSelectedRowsId(selectedRows.map((row) => row.id));
    console.log(
      "Selected rows:",
      selectedRows.map((row) => row.id)
    );
  };

  const updateStatus = async (status) => {
    console.log("Selected rows ID:", selectedRowsId);
    console.log("Selected status:", status);
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) => updateEventHvStatus(id, status))
      );
      handleFetchEvents();
      setSelectedRowsId([]);
      console.log("Status updated:", data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleShowModal = (row) => {
    setSelectedRow(row);
    setCurrentObservation(row.observations);
    setShowModalObs(true);
  };

  const handleCloseModalObs = () => setShowModalObs(false);
  const handleCloseModalDetail = () => setShowModalDetail(false);

  const handleSaveObservation = async (updatedObservation) => {
    if (selectedRow) {
      console.log("Saving observation:", updatedObservation);
      console.log("Selected row ID:", selectedRow.id);
      try {
        await updateAddObservations(selectedRow.id, updatedObservation);
        handleFetchEvents();
        handleCloseModalObs();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const onClear = (callback) => {
    if (callback) {
      callback({ target: { value: "" } });
    }
  };

  const handleDeleteDuplicates = async () => {
    if (!startDate || !endDate) {
      toast.error("Por favor, seleccione una fecha de inicio y fin");
      return;
    }

    try {
      const data = await deleteDuplicateEventsHv(startDate, endDate);
      handleFetchEvents();
      toast.success("Eventos duplicados eliminados");
      setStartDate("");
      setEndDate("");
      console.log("Duplicate events deleted:", data);
    } catch (error) {
      toast.error("Error al eliminar eventos duplicados");
      console.error("Error deleting duplicate events:", error);
    }
  };

  const ExpandedComponent = ({ data }) => {
    const attachments = JSON.parse(data.attachment);

    if (!attachments || attachments.length === 0) return "No existen archivos adjuntos";

    return (
      <div className="m-3">
        <Alert variant="info">
          <div className="d-flex flex-wrap">
            {Array.isArray(attachments) &&
              attachments.map((file, index) => (
                <div key={index} className="mt-3 p-2">
                  <p>{file.filename}</p>
                  <img
                    src={`http://localhost:5000/attachments/${file.path}`}
                    alt={file.filename}
                    width={250}
                  />
                </div>
              ))}
          </div>
        </Alert>
      </div>
    );
  };

  return (
    <Row className="p-4">
      <Col md={2} className="p-4 bg-dark-subtle rounded-3">
        <div>
          <img
            className="mb-3"
            src={darkMode ? logoDarkHv : logoHikvision}
            alt="Hikvision"
            width="120"
          />
        </div>

        <div className="mb-3">
          <MdCircle className="text-success" />
          &nbsp; Connected DVR: {testsCountData}
        </div>

        <Form.Group className=" border-2 bg-body-tertiary p-3 rounded-3">
          <Form.Control
            type="date"
            value={startDate}
            className="mb-3"
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Fecha de inicio"
          />
          <Form.Control
            type="date"
            value={endDate}
            className="mb-3"
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Fecha de fin"
          />
          <Button
            className="w-100"
            size="sm"
            variant="danger"
            onClick={handleDeleteDuplicates}
          >
            <FaTimes /> &nbsp; Eliminar Duplicados
          </Button>
        </Form.Group>

        <hr className="my-4" />

        <ProcessEmails />

        
      </Col>

      <Col md={10} className="px-4">
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
                      onClear();
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
                  <FaTimes onClick={() => onClear(handleStatusFilterChange)} />
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
                onClick={() => onClear(updateStatus(selectedStatus))}
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
                type="text"
                value={filterEventType}
                onChange={handleEventTypeFilterChange}
                placeholder="Filtro Tipo Evento"
              />
              <InputGroup.Text>
                {filterEventType ? (
                  <FaTimes
                    onClick={() => onClear(handleEventTypeFilterChange)}
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
        />
      </Col>

      <ObservationModal
        show={showModalObs}
        handleClose={handleCloseModalObs}
        observation={currentObservation}
        setObservation={setCurrentObservation}
        handleSave={handleSaveObservation}
      />

      <DetailHikvision
        show={showModalDetail}
        handleClose={handleCloseModalDetail}
        detail={currentDetail}
      />
    </Row>
  );
};

EventHv.propTypes = {
  data: PropTypes.array,
};

export default EventHv;
