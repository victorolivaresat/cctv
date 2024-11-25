import { Button, Card, Form, InputGroup, Col, Row } from "react-bootstrap";
import { FaDownload, FaEye, FaFilter, FaTimes } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";
import { formatDate } from "../../utils/DateUtils";
import DataTableBase from "../../utils/DataTable";
import ObservationModal from "./ObservationsModal";
import DetailHikvision from "./DetailHikvision";
import { MdApps, MdCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import { CSVLink } from "react-csv";
import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  eventsHv,
  distinctNameHvCount,
  updateEventHvStatus,
  updateAddObservations,
  getEventHvDetail,
} from "../../api/events";

// Iconos y recursos
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";

const EventHv = () => {
  // Estados
  const [currentObservation, setCurrentObservation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [testsCountData, setTestsCountData] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const darkMode = useDarkMode();

  // Filtros
  const [filterEventType, setFilterEventType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
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
    const eventTypeLower = event.eventType.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterNameLower = filterName.toLowerCase();
    const statusLower = event.status.toLowerCase();
    const eventDate = new Date(event.eventTime);
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
      minWidth: "200px",
    },
    {
      name: "Evento",
      selector: (row) => row.eventType,
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Camara(s)",
      selector: (row) => row.cameraName ? (row.cameraName === "null" ? "-" : row.cameraName) : "-",
      minWidth: "200px",
    },
    {
      name: "Dvr Fecha",
      selector: (row) => formatDate(row.eventTime),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Fecha Creacion At",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
      minWidth: "150px",
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
    },
    {
      name: "Accciones",
      cell: (row) => (
        <>
        <a href="#!" className="me-2"
          onClick={() => handleShowModal(row)}
        >
          <FaComment  className={row.observations ? "text-warning" : ""}/>
        </a>
        <a href="#!" className="me-2"
          onClick={() => getEventHvDetail(row.id)}
        >
          <FaEye/>
        </a>
        </>
        
      ),
      sortable: true,
      minWidth: "50px",
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
      console.log("Status updated:", data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
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
        await updateAddObservations(selectedRow.id, updatedObservation);
        handleFetchEvents();
        handleCloseModal();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleExportToCSV = () => {
    if (eventsData.length === 0) {
      return null; 
    }

    const csvData = eventsData
      .filter((transaction) => transaction.name)
      .map((transaction) => {
        const date = new Date(transaction.createdAt);
        const formattedDate = format(date, "dd-MM-yyyy HH:mm:ss");

        return {
          NombreTienda: transaction.name,
          TipoEvento: transaction.eventType,
          FechaCreacion: formattedDate,
          Status: transaction.status,
          Observacion: transaction.observations,
        };
      });

    if (csvData.length === 0) {
      return null;
    }

    const fileName = "detalles_transacciones_HikVision.csv";

    return (
      <CSVLink
        data={csvData}
        filename={fileName}
        className="bg-success text-light p-2 rounded-2 mb-2"
        style={{ marginTop: "15px", display: "block", textAlign: "center" }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaDownload style={{ marginRight: "5px" }} /> Descargar CSV
        </span>
      </CSVLink>
    );
  };

  const onClear = (callback) => {
    if (callback) {
      callback({ target: { value: "" } });
    }
  }

  return (
    <>
      <Card className="my-2">
        <Row>
          <Col lg={6}>
            <img
              className="m-2"
              src={darkMode ? logoDarkHv : logoHikvision}
              alt="Hikvision"
              width="100"
            />
          </Col>
          <Col lg={6} className="d-flex justify-content-end">
            <div className="d-flex align-items-center">
              <MdCircle className="text-success" />
              &nbsp; Connected Hikvision DVR: {testsCountData}
            </div>
          </Col>
        </Row>
      </Card>
      <div>
        <Row className="d-flex justify-content-between align-items-center">
          <Col md={4}>
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
                      onClear(); // Opcional: Si quieres una función adicional para manejar la limpieza
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

          <Col md={4}>
            <InputGroup className="my-1">
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="">Escoger Estado</option>
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
                Actualizar Estado
              </Button>
            </InputGroup>
          </Col>
        </Row>

        <Row className="d-flex justify-content-between align-items-center">
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

          <Col md={4}>
            <div className="my-1">{handleExportToCSV()}</div>
          </Col>
        </Row>
      </div>

      {/* Tabla de datos */}
      <DataTableBase
        columns={columns}
        data={filteredEventsData}
        paginationPerPage={10}
        selectableRows
        onSelectedRowsChange={handleRowSelection}
      />

      {/* Modal de observaciones */}
      <ObservationModal
        show={showModal}
        handleClose={handleCloseModal}
        observation={currentObservation}
        setObservation={setCurrentObservation}
        handleSave={handleSaveObservation}
      />
    </>
  );
};

EventHv.propTypes = {
  data: PropTypes.array,
};

export default EventHv;
