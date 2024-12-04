import { MdApps, MdVideocam, MdCheck, MdCircle } from "react-icons/md";
import { formatDate } from "../../../utils/DateUtils";
import DataTableBase from "../../../utils/DataTable";
import useDarkMode from "../../../hooks/useDarkMode";
import { FaEye, FaComment } from "react-icons/fa";
import ObservationModal from "../ObservationsModal";
import { Alert, Row, Col } from "react-bootstrap";
import FilterForm from "./FilterFormSamsung";
import DetailSamsung from "./DetailSamsung";
import { useEffect, useState } from "react";

import PropsTypes from "prop-types";
import {
  eventsSamsung,
  distinctNameSamsungCount,
  updateEventSamsungStatus,
  updateAddObservationsSamsung,
  getEventSamsungDetail,
} from "../../../api/events";

// Importar logos
import logoDarkSamsung from "../../../assets/img/samsung_dark.png";
import logoSamsung from "../../../assets/img/samsung.png";

const EventSamsung = () => {
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [selectedStatus2, setSelectedStatus2] = useState("new");

  const [testsCountData, setTestsCountData] = useState(0);
  const [eventsData, setEventsData] = useState([]);
  const { darkMode } = useDarkMode();
  const [selectedRowsId, setSelectedRowsId] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentObservation, setCurrentObservation] = useState("");

  const [filterDateTime, setFilterDateTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterEventName, setFilterEventName] = useState("");

  const [showModalDetail, setShowModalDetail] = useState(false);
  const [currentDetail, setCurrentDetail] = useState({});

  useEffect(() => {
    handleFetchEvents();
    handleFetchTestsCount();
  }, []);

  const handleFetchTestsCount = async () => {
    try {
      const data = await distinctNameSamsungCount();
      setTestsCountData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSamsungDetails = async (id) => {
    try {
      const data = await getEventSamsungDetail(id);
      setCurrentDetail(data);
      setShowModalDetail(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFetchEvents = async () => {
    try {
      const data = await eventsSamsung();
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
  const handleDateTimeFilterChange = handleFilterChange(setFilterDateTime);

  //Para que los filtros sean minusculas o mayusculas.
  const filteredEventsData = eventsData.filter((event) => {
    const filterNameLower = filterName.toLowerCase();
    const filterEventNameLower = filterEventName.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterDateTimeLower = filterDateTime.toLowerCase();

    const eventNameLower = event.name.toLowerCase();
    const eventEventNameLower = event.event_name.toLowerCase();
    const eventStatusLower = event.status.toLowerCase();
    const eventDateTimeLower = event.event_time.toLowerCase();

    return (
      (filterNameLower ? eventNameLower.includes(filterNameLower) : true) &&
      (filterEventNameLower
        ? eventEventNameLower.includes(filterEventNameLower)
        : true) &&
      (filterStatusLower
        ? eventStatusLower.includes(filterStatusLower)
        : true) &&
      (filterDateTimeLower
        ? eventDateTimeLower.includes(filterDateTimeLower)
        : true)
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
            onClick={() => getSamsungDetails(row.id)}
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
      <Alert
        className="mx-4 my-2 border-0 shadow-sm"
        variant="info"
        style={{ whiteSpace: "pre-line" }}
      >
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
        handleFetchEvents();
        handleCloseModal();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleStatusChange2 = (event) => {
    setSelectedStatus2(event.target.value);
  };

  const handleRowSelection = ({ selectedRows }) => {
    setSelectedRowsId(selectedRows.map((row) => row.id));
    console.log(
      "Selected rows:",
      selectedRows.map((row) => row.id)
    );
  };

  const updateObservations = async (observations) => {
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) =>
          updateAddObservationsSamsung(id, observations)
        )
      );
      handleFetchEvents();
      console.log("Validate updated:", data);
    } catch (error) {
      console.error("Error updating validate:", error);
    }
  };

  const updateStatus = async (status) => {
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) => updateEventSamsungStatus(id, status))
      );
      handleFetchEvents();
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
            alt="Hikvision"
            width="120"
          />
        </div>
        <div>
          <h6 className="my-3 small">
            <MdCircle className="text-success" />
            &nbsp; Connected DVR: {testsCountData}
          </h6>
        </div>
      </Col>
      <Col md="10" className="px-4">
        <FilterForm
          filterDateTime={filterDateTime}
          handleDateTimeFilterChange={handleDateTimeFilterChange}
          filterStatus={filterStatus}
          handleStatusFilterChange={handleStatusFilterChange}
          filterEventName={filterEventName}
          handleEventNameFilterChange={handleEventNameFilterChange}
          filterName={filterName}
          handleNameFilterChange={handleNameFilterChange}
          selectedStatus={selectedStatus}
          handleStatusChange={handleStatusChange}
          updateStatus={updateStatus}
          selectedStatus2={selectedStatus2}
          handleStatusChange2={handleStatusChange2}
          updateObservations={updateObservations}
          data={eventsData}
        />
        <DataTableBase
          columns={columns}
          data={filteredEventsData}
          paginationPerPage={10}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          selectableRows
          onSelectedRowsChange={handleRowSelection}
        />
      </Col>
      {/* Modal para agregar observaciones */}
      <ObservationModal
        show={showModal}
        handleClose={handleCloseModal}
        observation={currentObservation}
        setObservation={setCurrentObservation}
        handleSave={handleSaveObservation}
      />

      {/* Modal para ver detalles */}
      <DetailSamsung
        show={showModalDetail}
        handleClose={handleCloseModalDetail}
        detail={currentDetail}
      />
    </Row>
  );
};

EventSamsung.propTypes = {
  data: PropsTypes.array,
};

export default EventSamsung;
