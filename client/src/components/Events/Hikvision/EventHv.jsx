import {
  eventsHv,
  distinctNameHvCount,
  updateEventHvStatus,
  updateAddObservations,
} from "../../../api/events";

import {
  formatDate,
  formatDateInput,
  getTomorrowDate,
  getYesterdayDate,
  validateDateRange,
} from "../../../utils/DateUtils";
import { Button, Form, InputGroup, Col, Row, Alert } from "react-bootstrap";
import { FaEye, FaFilter, FaTimes, FaUndo } from "react-icons/fa";

import ExcelExport from "../../../utils/ExcelExport";
import useDarkMode from "../../../hooks/useDarkMode";
import DataTableBase from "../../../utils/DataTable";
import ObservationModal from "../ObservationsModal";
import { MdApps, MdCircle } from "react-icons/md";
import DetailHikvision from "./DetailHikvision";
import RemoveDuplicate from "./RemoveDuplicate";
import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import PropTypes from "prop-types";

// Iconos y recursos
import logoDarkHv from "../../../assets/img/hikvision_dark.png";
import logoHikvision from "../../../assets/img/hikvision.png";

const EventHv = () => {
  // Estados
  const [currentObservation, setCurrentObservation] = useState(null);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [showModalObs, setShowModalObs] = useState(false);
  const [testsCountData, setTestsCountData] = useState(0);
  const [currentDetail, setCurrentDetail] = useState({});
  const [selectedRow, setSelectedRow] = useState("");
  const [eventsData, setEventsData] = useState([]);
  const { darkMode } = useDarkMode();


  // Filtros
  const [startDate, setStartDate] = useState(formatDateInput(getYesterdayDate()));
  const [endDate, setEndDate] = useState(formatDateInput(getTomorrowDate()));
  const [filterEventType, setFilterEventType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    handleFetchTestsCount();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      handleFetchEvents(startDate, endDate);
    }
  }, [startDate, endDate]);

  // Eventos
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

      const data = await eventsHv(startDate, endDate);
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Hikvision Count Events distinct name
  const handleFetchTestsCount = async () => {
    try {
      const data = await distinctNameHvCount();
      setTestsCountData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Funciones
  const handleFilterChange = (filterFunction) => (e) => {
    filterFunction(e.target.value);
    console.log(e.target.value);
  };

  // Funciones de filtro
  const handleEventTypeFilterChange = handleFilterChange(setFilterEventType);
  const handleStatusFilterChange = handleFilterChange(setFilterStatus);
  const handleNameFilterChange = handleFilterChange(setFilterName);

  const filteredEventsData = eventsData.filter((event) => {
    const filterEventTypeLower = filterEventType.toLowerCase();
    const eventTypeLower = event.event_type.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterNameLower = filterName.toLowerCase();
    const statusLower = event.status.toLowerCase();
    const nameLower = event.name.toLowerCase();

    return (
      (filterStatusLower ? statusLower.includes(filterStatusLower) : true) &&
      (filterEventTypeLower
        ? eventTypeLower.includes(filterEventTypeLower)
        : true) &&
      (filterNameLower ? nameLower.includes(filterNameLower) : true)
    );
  });

  // Obtener detalles del evento
  const getEventHvDetails = (row) => {
    setShowModalDetail(true);
    setCurrentDetail(row);
  };

  // Obtener nombre del estado
  const getStatusName = (status) => {
    const statusNames = {
      new: "Nuevo",
      pending: "Pendiente",
      completed: "Completado",
    };
    return statusNames[status];
  };

  // Columnas de la tabla
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
      minWidth: "80px",
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
            onClick={() => getEventHvDetails(row)}
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

  // Funciones de actualización
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Funciones de selección
  const handleRowSelection = ({ selectedRows }) => {
    setSelectedRowsId(selectedRows.map((row) => row.id));
  };

  // Funciones de actualización
  const handleClearRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  // 
  const updateStatus = async (status) => {
    console.log("Selected rows ID:", selectedRowsId);
    console.log("Selected status:", status);
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) => updateEventHvStatus(id, status))
      );
      handleFetchEvents(startDate, endDate);
      handleClearRows();
      console.log("Status updated:", data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Observaciones
  const handleShowModal = (row) => {
    setSelectedRow(row);
    setCurrentObservation(row.observations);
    setShowModalObs(true);
  };

  const handleSaveObservation = async (updatedObservation) => {
    if (selectedRow) {
      console.log("Saving observation:", updatedObservation);
      console.log("Selected row ID:", selectedRow.id);
      try {
        await updateAddObservations(selectedRow.id, updatedObservation);
        handleFetchEvents(startDate, endDate);
        setCurrentObservation("");
        handleCloseModalObs();
        //setShowModalObs(false);
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleCloseModalObs = () => { setShowModalObs(false); };
  const handleCloseModalDetail = () => { setShowModalDetail(false); };

  // Componente expandido
  const ExpandedComponent = ({ data }) => {
    let attachments = data.attachment;

    if (!attachments || attachments.length === 0 || !attachments === "") {
      return (
        <div className="m-3">
          <Alert variant="warning">
            <p>No hay archivos adjuntos</p>
          </Alert>
        </div>
      );
    }

    attachments = JSON.parse(attachments);

    return (
      <div className="m-3">
        <Alert variant="info">
          <div className="d-flex flex-wrap">
            {Array.isArray(attachments) &&
              attachments.map((file, index) => (
                <div key={index} className="mt-3 p-2">
                  <p>{file.filename}</p>
                  <img
                    src={`http://localhost:5000/attachments/${file.filename}`}
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
      <Col md={2} className="p-4 mb-4 bg-dark-subtle rounded-3">
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

        <hr className="mb-3" />

        <RemoveDuplicate onUpdate={() => handleFetchEvents(startDate, endDate)} />

      </Col>

      <Col md={10} className="px-4">
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
                value={filterEventType}
                onChange={handleEventTypeFilterChange}
                placeholder="Evento"
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
