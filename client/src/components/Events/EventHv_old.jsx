import { useState, useContext, useEffect } from "react";
import { Button, Card, Dropdown, Alert, Form, InputGroup } from "react-bootstrap";
import { MdApps, MdRefresh, MdCircle, MdEmail, MdVideoFile, MdUpdate } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import PropTypes from "prop-types";
import { eventsHv, distinctNameHvCount, updateEventHvStatus, putUpdateAddObservations } from "../../api/events";
import  useDarkMode from "../../hooks/useDarkMode";
import { formatDate } from "../../utils/DateUtils";
import DataTableBase from "../../utils/DataTable";
import FilterForm from "./FilterForm";
import ObservationModal from "./ObservationsModal"; // Importa el componente del modal
import { FaDownload, FaFilter, FaTimes } from "react-icons/fa";

import { CSVLink } from "react-csv";

import { format } from 'date-fns';

// Iconos y recursos
import logoDarkHv from "../../assets/img/hikvision_dark.png";
import logoHikvision from "../../assets/img/hikvision.png";

const EventHv = () => {
  // Estados
  const [selectedStatus, setSelectedStatus] = useState("new");
  const [selectedStatus2, setSelectedStatus2] = useState("new");
  const [selectedRowsId, setSelectedRowsId] = useState([]);
  const [testsCountData, setTestsCountData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentObservation, setCurrentObservation] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const darkMode = useDarkMode();

  // Filtros
  const [filterEventType, setFilterEventType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    handleFetchEvents();
    handleFetchTestsCount();
  }, []);

  

  const handleFetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventsHv();
      setEventsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
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


  //Para que los filtros sean minusculas o mayusculas.
  const filteredEventsData = eventsData.filter((event) => {
    // Convertir todos los valores a minúsculas para hacer la comparación insensible al caso
    //const filterStartDateLower = filterStartDate.toLowerCase();
    //const filterEndDateLower = filterEndDate.toLowerCase();
    const filterStatusLower = filterStatus.toLowerCase();
    const filterEventTypeLower = filterEventType.toLowerCase();
    const filterNameLower = filterName.toLowerCase();

    //const eventTimeLower = event.eventTime.toLowerCase();
    const statusLower = event.status.toLowerCase();
    const eventTypeLower = event.eventType.toLowerCase();
    const nameLower = event.name.toLowerCase();

    const eventDate = new Date(event.eventTime);
    const startDate = new Date(filterStartDate);
    const endDate = new Date(filterEndDate);

    return (
      (!filterStartDate || eventDate >= startDate) &&
      (!filterEndDate || eventDate <= endDate) &&
      (filterStatusLower ? statusLower.includes(filterStatusLower) : true) &&
      (filterEventTypeLower ? eventTypeLower.includes(filterEventTypeLower) : true) &&
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

  const ExpandedComponent = ({ data }) => {
    const attachments = JSON.parse(data.attachment);
    const cameraNames = data.cameraName
      ? data.cameraName.match(/\(([^)]+)\)/g) || []
      : [];

    return (
      <div className="m-3">
        <Alert variant="info">
          <p className="fs-5">
            <MdVideoFile /> Details:
          </p>
          {cameraNames.length > 0 ? (
            cameraNames.map((name, index) => (
              <span key={index}>
                Camera {index > 0 && " "} [{name.slice(1, -1)}] &nbsp; ✓ &nbsp;
              </span>
            ))
          ) : (
            <p>No hay más datos</p>
          )}
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

  const columns = [
    {
      cell: () => <MdApps style={{ fill: "#43a047" }} />,
      width: "50px",
      style: { marginBottom: "-1px" },
    },
    { name: "Nombre Tienda", selector: (row) => row.name, sortable: true },
    { name: "Evento", selector: (row) => row.eventType, sortable: true },
    {
      name: "Dvr Fecha",
      selector: (row) => formatDate(row.eventTime),
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
    `Fecha del Dvr: ${formatDate(row.eventTime)}\n` +
    `Creado En: ${formatDate(row.createdAt)}\n` +
    `Estado: ${getStatusName(row.status)}\n` +
    `Tipo: HikVision\n` +
    `Observaciones: ${row.observations}`;


    // Agregar el nombre de la cámara si el tipo de evento es 'Video Signal Lost'
    if (row.eventType === 'Video Signal Lost') {
      emailBody += `\nNombre de la Cámara: ${row.cameraName}`;
    }
  
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
  
  
  const handleEmailSend2 = async (row) => {
    
  
    try {

  
        await updateEventHvStatus(row.id, 'pending');
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
        selectedRowsId.map((id) => putUpdateAddObservations(id, observations))
      );
      handleFetchEvents();
      console.log("Validate updated:", data);
    } catch (error) {
      console.error("Error updating validate:", error);
    }
  };

  /*const handleObservationsClick = async (e, row) => {
    const newObservationStatus =
      row.observations === "Validado" ? "No Validado" : "Validado";
    if (newObservationStatus === "Validado") {
      const alert = confirm("¿Está seguro de validar la transacción?");
      if (alert) {
        const result = await putUpdateAddObservations(row.id, newObservationStatus);
        console.log(result);
        handleFetchEvents();
      }
    } else {
      const alert = confirm("¿Está  seguro de invalidar la transacción?");
      if (alert) {
        const result = await putUpdateAddObservations(row.id, newObservationStatus);
        console.log(result);
        handleFetchEvents();
      }
    }
  };*/

  const updateStatus = async (status) => {
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


  /*
  const handleEmailSend = async (row) => {
    const attachments = JSON.parse(row.attachment);
    let emailBody = `
      Name: ${row.name}\n
      Event: ${row.eventType}\n
      Dvr Date: ${formatDate(row.eventTime)}\n
      Created At: ${formatDate(row.createdAt)}\n
      Status: ${getStatusName(row.status)}\n
      Observaciones: ${row.observations}\n
    `;
    if (Array.isArray(attachments) && attachments.length > 0) {
      emailBody += "Attachments:\n";
      attachments.forEach((file) => {
        emailBody += `Filename: ${file.filename}, Path: ${file.path}\n`;
      });
    }
  
    try {
      const response = await fetch("/api/v1/sendEmail", {  // Asegúrate de que la URL sea correcta
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailBody,
          to: 'recipient@example.com',
          subject: 'Subject of the email',
        }),
      });
  
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        const text = await response.text(); // Para obtener detalles del error
        console.error('Error response:', text);
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };*/
  
  

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
        await putUpdateAddObservations(selectedRow.id, updatedObservation);
        handleFetchEvents();
        handleCloseModal();
      } catch (error) {
        console.error("Error updating observation:", error);
      }
    }
  };

  const handleExportToCSV = () => {

    if (eventsData.length === 0) {
      return null; // No hay datos para exportar
    }
    // Transforma los datos en el formato esperado por react-csv
    const csvData = eventsData
    .filter((transaction) => transaction.name) // Filtrar elementos con beneficiary no vacío
    .map((transaction) => {
      const date = new Date(transaction.createdAt);
      const formattedDate = format(date, 'dd-MM-yyyy HH:mm:ss');
      
      return {
        NombreTienda: transaction.name,
        TipoEvento: transaction.eventType,
        FechaCreacion: formattedDate,
        Status: transaction.status,
        Observacion: transaction.observations,
      };
    });


    // Si no hay datos válidos después de filtrar, devuelve null
    if (csvData.length === 0) {
      return null;
    }

    const fileName = "detalles_transacciones_HikVision.csv";

    // Renderiza un enlace de descarga utilizando CSVLink de react-csv
    return (
      <CSVLink
        data={csvData}
        filename={fileName}
        className="bg-success text-light p-2 rounded-2 mb-2"
        style={{ marginTop: "15px", display: "block", textAlign: "center" }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FaDownload style={{ marginRight: "5px" }} /> Descargar CSV
        </span>
      </CSVLink>
    );
  };

  // const onClear = (clearFunc) => {
  //   clearFunc({ target: { value: "" } });
  // };


  return (
    <>
      {/* Encabezado de la página */}
      <Card className="shadow my-2 p-2">
        <div>
          <img
            className="m-2 float-end"
            src={darkMode ? logoDarkHv : logoHikvision}
            alt="Hikvision"
            width="100"
          />
          <h4 className="text-primary-emphasis m-2">
            Events Hikvision
            {isLoading && <MdRefresh className="spinner" />}
          </h4>
        </div>
        <div>
          <Button
            className="m-2 float-end"
            variant="primary"
            size="sm"
            onClick={handleFetchEvents}
          >
            <MdUpdate />
            &nbsp; Get Events Hikvision
          </Button>
          <div className="d-flex justify-content-between align-items-center my-3">
            <div className="d-flex align-items-center">
              <MdCircle className="text-success" />
              &nbsp; Connected Hikvision DVR: {testsCountData}
            </div>

          </div>
        </div>
        
      </Card>
      {/* Formulario de Filtros */}
      
  <div className="d-flex justify-content-between align-items-center">
  {/*<Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
      Filtros específicos
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <FilterForm
        filterDate={filterDate}
        handleDateFilterChange={handleDateFilterChange}
        filterStatus={filterStatus}
        handleStatusFilterChange={handleStatusFilterChange}
        filterEventType={filterEventType}
        handleEventTypeFilterChange={handleEventTypeFilterChange}
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
  </Dropdown>*/}

  <div className="mx-auto">
      <InputGroup className="my-3">
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
            <FaTimes onClick={() => {
              handleStartDateFilterChange({ target: { value: '' } });
              handleEndDateFilterChange({ target: { value: '' } });
              onClear(); // Opcional: Si quieres una función adicional para manejar la limpieza
            }} />
          ) : (
            <FaFilter />
          )}
        </InputGroup.Text>
      </InputGroup>
    </div>

          {/*
    <div className="mx-auto">
    <InputGroup className="my-3">
      <Form.Control
        type="date"
        value={filterDate}
        onChange={handleDateFilterChange}
        placeholder="Filtro Fecha"
        />
        <InputGroup.Text>
          {filterName ? (
          <FaTimes onClick={() => onClear(handleDateFilterChange)} />
            ) : (
              <FaFilter />
            )}
        </InputGroup.Text>
    </InputGroup> 
    </div>*/}

    <div className="mx-auto">
    <InputGroup className="my-3">
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
    </div>

  <div className="mx-auto">
    <InputGroup className="my-3">
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
    </div>

    <div className="mx-auto">
    <InputGroup className="my-3">
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
    </div>


    <div className="mx-auto">
    <InputGroup className="my-3">
      <Form.Control
        type="text"
        value={filterEventType}
        onChange={handleEventTypeFilterChange}
        placeholder="Filtro Tipo Evento"
        />
        <InputGroup.Text>
          {filterName ? (
          <FaTimes onClick={() => onClear(handleEventTypeFilterChange)} />
            ) : (
              <FaFilter />
            )}
        </InputGroup.Text>
    </InputGroup> 
    </div>

  <div className="ml-3">
    {handleExportToCSV()}
  </div>
</div>



      {/* Tabla de datos */}
      <DataTableBase
        columns={columns}
        data={filteredEventsData}
        paginationPerPage={10}
        expandableRowsComponent={ExpandedComponent}
        expandableRows
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
