import {
  MdApps,
  MdRefresh,
  MdVideocam,
  MdCheck,
  MdCircle,
  MdEmail,
} from "react-icons/md";
import logoDarkSamsung from "../../assets/img/samsung_dark.png";
import useDarkMode from "../../hooks/useDarkMode";
import { useEffect, useState } from "react";
import logoSamsung from "../../assets/img/samsung.png";
import { formatDate } from "../../utils/DateUtils";
import DataTableBase from "../../utils/DataTable";
import { eventsSamsung, distinctNameSamsungCount, updateEventSamsungStatus, putUpdateAddObservationsSamsung } from "../../api/events";
import { Dropdown, Button, Alert } from "react-bootstrap";
import PropsTypes from "prop-types";
import ObservationModal from "./ObservationsModal";
import FilterForm from "./FilterForm/FilterFormSamsung";

import {  FaPlus } from "react-icons/fa";

const EventSamsung = () => {
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [selectedStatus2, setSelectedStatus2] = useState("new");

  const [testsCountData, setTestsCountData] = useState(0);
  const [eventsData, setEventsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const darkMode = useDarkMode();
  const [selectedRowsId, setSelectedRowsId] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentObservation, setCurrentObservation] = useState("");

  const [filterDateTime, setFilterDateTime] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterEventName, setFilterEventName] = useState("");



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

  const handleFetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsSamsung();
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }

  const handleFilterChange = (filterFunction) => (e) => {
    filterFunction(e.target.value);
    console.log(e.target.value);
  };

  const handleNameFilterChange = handleFilterChange(setFilterName);
  const handleStatusFilterChange = handleFilterChange(setFilterStatus);
  const handleEventNameFilterChange = handleFilterChange(setFilterEventName);
  const handleDateTimeFilterChange = handleFilterChange(setFilterDateTime);

  //Para que los filtros sean minusculas o mayusculas.
  const filteredEventsData = eventsData.filter((event) => {
    // Convertir todos los valores a minúsculas para hacer la comparación insensible al caso
    const filterNameLower = filterName.toLowerCase();
    const filterEventNameLower = filterEventName.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterDateTimeLower = filterDateTime.toLowerCase();
  
    const eventNameLower = event.name.toLowerCase();
    const eventEventNameLower = event.eventName.toLowerCase();
    const eventStatusLower = event.status.toLowerCase();
    const eventDateTimeLower = event.dateTime.toLowerCase();
  
    return (
      (filterNameLower ? eventNameLower.includes(filterNameLower) : true) &&
      (filterEventNameLower ? eventEventNameLower.includes(filterEventNameLower) : true) &&
      (filterStatusLower ? eventStatusLower.includes(filterStatusLower) : true) &&
      (filterDateTimeLower ? eventDateTimeLower.includes(filterDateTimeLower) : true)
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
    },
    {
      name: "Fecha Dvr",
      selector: (row) => formatDate(row.dateTime),
      sortable: true,
    },
    {
      name: "Fecha Creacion At",
      selector: (row) => formatDate(row.createdAt),
      sortable: true,
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
    },
    {
      name: "Observacion",
      cell: (row) => (
        <div className="py-1 px-2 d-flex align-items-center">
          <Button
            variant="primary"
            onClick={() => handleShowModal(row)}
            className="me-2"
          >
            <FaPlus /> Agregar
          </Button>
          <span>{row.observations}</span>
        </div>
      ),
      sortable: true,
    },
    /*{
      name: "Send Email",
      cell: (row) => (
        <a className="fs-5 text-info" onClick={() => handleEmailSend(row)}>
          <MdEmail />
        </a>
      ),
      center: true,
    },*/
    {
      name: "Enviar Correo",
      cell: (row) => (
        <a className="fs-5 text-info" href={constructMailtoLink(row)} onClick={() => handleEmailSend2(row)}>
          <MdEmail />
        </a>
      ),
      center: true,
    }
  ];

  const constructMailtoLink = (row) => {
    // Parsear los archivos adjuntos desde JSON
    //const attachments = JSON.parse(row.attachment);
  
    // Empezar a construir el cuerpo del correo
    let emailBody = 
    `Id: ${row.id}\n` +
    `Nombre: ${row.name}\n` +
    `Evento: ${row.eventType}\n` +
    `MAC address: ${row.macAddress}\n` +
    `Evento Nombre: ${row.eventName}\n` +
    `Creado En: ${formatDate(row.createdAt)}\n` +
    `Estado: ${getStatusName(row.status)}\n` +
    `Tipo: Samsung\n` +
    `Observaciones: ${row.observations}`;

  
    // Agregar los archivos adjuntos si existen
    /*if (Array.isArray(attachments) && attachments.length > 0) {
      emailBody += "Archivos Adjuntos:\n";
      attachments.forEach((file) => {
        emailBody += `Nombre del Archivo: ${file.filename}, Ruta: ${file.path}\n`;
      });
    }*/
  
    // Codificar el cuerpo del correo para asegurar que sea seguro para URLs
    const encodedBody = encodeURIComponent(emailBody);
  
    // Devolver el enlace mailto con el asunto y el cuerpo codificado
    return `mailto:recipient@example.com?subject=Asunto del correo&body=${encodedBody}`;
  };

  const ExpandedComponent = ({ data }) => {
    const eventName = JSON.parse(data.eventName);
    const formattedData = Object.entries(eventName)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
      .replace(/(\d+\.)/g, "\n$1");
    return (
      <Alert
        className="small mx-4 my-2 border-0 shadow-sm"
        variant="info"
        style={{ whiteSpace: "pre-line" }}
      >
        <h6>
          <MdVideocam className="me-2" />
          Event Name
        </h6>
        <MdCheck className="me-2" />
        {formattedData}
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
      console.log("Saving observation:", updatedObservation); // Añade esto para depurar
      console.log("Selected row ID:", selectedRow.id); // Añade esto para depurar
      try {
        await putUpdateAddObservationsSamsung(selectedRow.id, updatedObservation);
        handleFetchEvents();
        handleCloseModal();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleEmailSend2 = async (row) => {
    
  
    try {

  
        await updateEventSamsungStatus(row.id, 'pending');
        handleFetchEvents(); // Actualiza la lista de eventos
        alert("¡Correo electrónico enviado exitosamente y estado actualizado a 'Pendiente'!");
     
        //const text = await response.text(); // Para obtener detalles del error
        //console.error('Error response:', text);
        //alert("Failed to send email.");
      
    } catch (error) {
      console.error("Error sending email:", error);
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
    console.log("Selected rows:", selectedRows.map((row) => row.id));
  };

  const updateObservations = async (observations) => {
    try {
      const data = await Promise.all(
        selectedRowsId.map((id) => putUpdateAddObservationsSamsung(id, observations))
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
    <>
      <div>
        <img
          className="m-2 float-end"
          src={darkMode ? logoDarkSamsung : logoSamsung}
          alt="Hikvision"
          width="100"
        />
        <h4 className="text-primary-emphasis m-2">
          Events Samsung
          {isLoading && <MdRefresh className="spinner" />}
        </h4>
        <h6 className="my-3">
          <MdCircle className="text-success" />
          &nbsp; Connected Samsung DVR: {testsCountData}
        </h6>
      </div>

      <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Filtros específicos
          </Dropdown.Toggle>
          <Dropdown.Menu>
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
            />
          </Dropdown.Menu>
        </Dropdown>

      <DataTableBase
        columns={columns}
        data={filteredEventsData}
        paginationPerPage={10}
        expandableRows
        expandableRowsComponent={ExpandedComponent}
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

EventSamsung.propTypes = {
  data: PropsTypes.array,
};

export default EventSamsung;
