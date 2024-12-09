import DvrControlFormModal from "../../components/DvrControl/DvrFormModal";
import StatusPieChart from "../../components/DvrControl/StatusPieChart";
import withReactContent from "sweetalert2-react-content";
import ExcelExport from "../../utils/ExcelExport";
import DataTableBase from "../../utils/DataTable";
import { useState, useEffect } from "react";
import { MdApps } from "react-icons/md";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import {
  getAllDvrControls,
  createDvrControl,
  updateDvrControl,
  deleteDvrControl,
  updateDvrControlStatus,
  getStoreStatusCounts,
} from "../../api/dvrControl";
import {
  Form,
  Button,
  Row,
  Col,
  Alert,
  InputGroup,
  Card,
} from "react-bootstrap";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaUserTie,
  FaCircle,
  FaTimes,
  FaFilter,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

const DvrControl = () => {
  const [showModal, setShowModal] = useState(false);
  const [dvrControls, setDvrControls] = useState([]);
  const [selectedDvrControl, setSelectedDvrControl] = useState(null);
  const [statusCounts, setStatusCounts] = useState([]);

  // Filtros
  const [filterSupervisorAreaManager, setFilterSupervisorAreaManager] = useState("");
  const [filterSupervisorName, setFilterSupervisorName] = useState("");
  const [filterSupervisorZone, setFilterSupervisorZone] = useState("");
  const [filterStoreName, setFilterStoreName] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDvrName, setFilterDvrName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  useEffect(() => {
    fetchDvrControls();
    fetchStatusCounts();
  }, []);

  const fetchDvrControls = async () => {
    try {
      const data = await getAllDvrControls();
      const deserializedData = data.map(control => ({
        ...control,
        supervisor: JSON.parse(control.supervisor)
      }));
      setDvrControls(deserializedData);
      console.log("DVR Controls", deserializedData);
    } catch (error) {
      console.error("Error fetching DVR controls:", error);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const data = await getStoreStatusCounts();
      setStatusCounts(data);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedDvrControl) {
        const updatedDvrControl = await updateDvrControl(
          selectedDvrControl.id,
          formData
        );
        toast.success("DVR Control updated successfully!");
        console.log("updatedDvrControl", updatedDvrControl);
        fetchDvrControls();
      } else {
        const newDvrControl = await createDvrControl(formData);
        toast.success("DVR Control created successfully!");
        fetchDvrControls();
        console.log("newDvrControl", newDvrControl);
      }
      setShowModal(false);
      setSelectedDvrControl(null);
      fetchStatusCounts(); // Actualizar el gráfico de pastel
    } catch (error) {
      console.error("Error saving DVR control:", error);
    }
  };

  const handleDeleteDvrControl = async (id) => {
    try {
      await deleteDvrControl(id);
      setDvrControls(dvrControls.filter((dvrControl) => dvrControl.id !== id));
      fetchDvrControls();
      fetchStatusCounts();
    } catch (error) {
      console.error("Error deleting DVR control:", error);
    }
  };

  const confirmDeleteDvrControl = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteDvrControl(id);
        MySwal.fire("Deleted!", "DVR Control has been deleted.", "success");
      }
    });
  };

  const handleEditDvrControl = (dvrControl) => {
    setSelectedDvrControl(dvrControl);
    setShowModal(true);
  };

  const handleToggleActive = async (dvrControl) => {
    try {
      const updatedDvrControl = await updateDvrControlStatus(
        dvrControl.id,
        !dvrControl.notifications_status
      );
      setDvrControls(
        dvrControls.map((dvr) =>
          dvr.id === dvrControl.id ? updatedDvrControl : dvr
        )
      );
      toast.success("DVR Control status updated successfully!");
      fetchStatusCounts();
    } catch (error) {
      console.error("Error updating DVR control status:", error);
    }
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterStoreNameChange = (e) => {
    setFilterStoreName(e.target.value);
  };

  const handleFilterCompanyChange = (e) => {
    setFilterCompany(e.target.value);
  };

  const handleFilterDvrNameChange = (e) => {
    setFilterDvrName(e.target.value);
  };

  const handleFilterSupervisorNameChange = (e) => {
    setFilterSupervisorName(e.target.value);
  };

  const handleFilterSupervisorZoneChange = (e) => {
    setFilterSupervisorZone(e.target.value);
  };

  const handleFilterSupervisorAreaManagerChange = (e) => {
    setFilterSupervisorAreaManager(e.target.value);
  };

  const filteredDvrControls = dvrControls.filter((control) => {
    const filterStatusLower = filterStatus.toLowerCase();
    const filterStoreNameLower = filterStoreName.toLowerCase();
    const filterCompanyLower = filterCompany.toLowerCase();
    const filterDvrNameLower = filterDvrName.toLowerCase();
    const filterSupervisorNameLower = filterSupervisorName.toLowerCase();
    const filterSupervisorZoneLower = filterSupervisorZone.toLowerCase();
    const filterSupervisorAreaManagerLower = filterSupervisorAreaManager.toLowerCase();
  
    const storeNameLower = control.store_name ? control.store_name.toLowerCase() : "";
    const statusLower = control.notifications_status ? "active" : "inactive";
    const companyLower = control.company_name ? control.company_name.toLowerCase() : "";
    const dvrNameLower = control.dvr_name ? control.dvr_name.toLowerCase() : "";
    const supervisorNameLower = control.supervisor && control.supervisor.name ? control.supervisor.name.toLowerCase() : "";
    const supervisorZoneLower = control.supervisor && control.supervisor.zone ? control.supervisor.zone.toLowerCase() : "";
    const supervisorAreaManagerLower = control.supervisor && control.supervisor.area_manager ? control.supervisor.area_manager.toLowerCase() : "";
  
    return (
      (!filterStatusLower || statusLower.includes(filterStatusLower)) &&
      (!filterStoreNameLower || storeNameLower.includes(filterStoreNameLower)) &&
      (!filterCompanyLower || companyLower.includes(filterCompanyLower)) &&
      (!filterDvrNameLower || dvrNameLower.includes(filterDvrNameLower)) &&
      (!filterSupervisorNameLower || supervisorNameLower.includes(filterSupervisorNameLower)) &&
      (!filterSupervisorZoneLower || supervisorZoneLower.includes(filterSupervisorZoneLower)) &&
      (!filterSupervisorAreaManagerLower || supervisorAreaManagerLower.includes(filterSupervisorAreaManagerLower))
    );
  });

  const columns = [
    {
      cell: () => <MdApps style={{ fill: "#43a047" }} />,
      width: "50px",
      style: { marginBottom: "-1px" },
    },
    {
      name: "Tienda",
      selector: (row) => row.store_name,
      sortable: true,
    },
    {
      name: "Empresa",
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: "DVR Marca",
      selector: (row) => row.dvr_name,
      sortable: true,
    },
    {
      name: "Email de Salida",
      selector: (row) => row.notification_email_out,
      sortable: true,
    },
    {
      name: "Conexión Remota",
      selector: (row) => row.remote_connection_tool,
      sortable: true,
    },
    {
      name: "ID conexión remota",
      selector: (row) => row.remote_connection_id,
      sortable: true,
    },

    {
      name: "Status",
      cell: (row) => (
        <Form.Check
          type="switch"
          id={`is-active-switch-${row.id}`}
          checked={row.notifications_status}
          onChange={() => handleToggleActive(row)}
        />
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Button
            href="#"
            variant="primary"
            size="sm"
            onClick={() => handleEditDvrControl(row)}
            className="me-2 py-1 px-2 rounded-5"
          >
            <FaEdit />
          </Button>
          <Button
            href="#"
            variant="danger"
            size="sm"
            onClick={() => confirmDeleteDvrControl(row.id)}
            className="me-2 py-1 px-2 rounded-5"
          >
            <FaTrash />
          </Button>
        </>
      ),
    },
  ];

  // Componente expandido
  const ExpandedComponent = ({ data }) => {
    let supervisorData = data.supervisor;

    if (!supervisorData || supervisorData.length === 0 || !supervisorData) {
      return (
        <div className="m-3">
          <Alert variant="warning">
            <p>No Información del Supervisor</p>
          </Alert>
        </div>
      );
    }

    return (
      <div className="m-3">
        <Alert variant="info" style={{ width: "350px" }}>
          <div className="d-flex flex-wrap align-items-center">
            <div className="me-4">
              <FaUserTie size={30} />
            </div>
            <div>
              <p className="mb-2">
                <strong>
                  <FaCircle className="me-2" />
                  SUPERVISOR
                </strong>
              </p>
              <p className="mb-1">
                <strong>Nombre:</strong>&nbsp; {supervisorData.name}
              </p>
              <p className="mb-1">
                <strong>Telefono:</strong>&nbsp; {supervisorData.phone}
              </p>
              <p className="mb-1">
                <strong>Zona:</strong>&nbsp; {supervisorData.zone}
              </p>
              <p className="mb-1">
                <strong>Jefe Comercial:</strong>&nbsp;{" "}
                {supervisorData.area_manager}
              </p>
            </div>
          </div>
        </Alert>
      </div>
    );
  };

  // Exportar a Excel
  const handleExportToExcel = () => {
    const exportData = dvrControls.map(control => ({      
      "Tienda": control.store_name,
      "Empresa": control.company_name,
      "DVR (Marca)": control.dvr_name,
      "Email de Entrada": control.notification_email_in,
      "Email de Salida": control.notification_email_out,
      "Conexión Remota": control.remote_connection_tool,
      "Conexión Remota ID": control.remote_connection_id,
      "Estado": control.notifications_status ? "Activado" : "Desactivado",
      "Notas": control.notes,
      "Supervisor": control.supervisor.name,
      "Telefono Sup.": control.supervisor.phone,
      "Jefe Comercial": control.supervisor.area_manager,
      "Zona": control.supervisor.zone,
    }));

    return exportData;
  };

  return (
    <Row className="p-4">
      <Col className="p-4 mb-4 bg-dark-subtle rounded-3" md={2}>
        <StatusPieChart data={statusCounts} />

        <Button
          className="w-100 mb-3"
          size="sm"
          onClick={() => {
            setShowModal(true);
            setSelectedDvrControl(null);
          }}
        >
          <FaPlus className="me-2" />
          Agregar Control DVR
        </Button>
      </Col>

      <Col className="px-4" md={10}>
        <Card className="bg-body-tertiary mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    as="select"
                    value={filterStatus}
                    onChange={handleFilterStatusChange}
                    placeholder="Filtrar por estado"
                  >
                    <option value="">Estado</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </Form.Control>
                  <InputGroup.Text>
                    {filterStatus ? (
                      <FaTimes onClick={() => setFilterStatus("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterStoreName}
                    onChange={handleFilterStoreNameChange}
                    placeholder="Tienda"
                  />
                  <InputGroup.Text>
                    {filterStoreName ? (
                      <FaTimes onClick={() => setFilterStoreName("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterCompany}
                    onChange={handleFilterCompanyChange}
                    placeholder="Empresa"
                  />
                  <InputGroup.Text>
                    {filterCompany ? (
                      <FaTimes onClick={() => setFilterCompany("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterDvrName}
                    onChange={handleFilterDvrNameChange}
                    placeholder="DVR (Marca)"
                  />
                  <InputGroup.Text>
                    {filterDvrName ? (
                      <FaTimes onClick={() => setFilterDvrName("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterSupervisorName}
                    onChange={handleFilterSupervisorNameChange}
                    placeholder="Supervisor"
                  />
                  <InputGroup.Text>
                    {filterSupervisorName ? (
                      <FaTimes onClick={() => setFilterSupervisorName("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterSupervisorZone}
                    onChange={handleFilterSupervisorZoneChange}
                    placeholder="Zona"
                  />
                  <InputGroup.Text>
                    {filterSupervisorZone ? (
                      <FaTimes onClick={() => setFilterSupervisorZone("")} />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <InputGroup className="my-1">
                  <Form.Control
                    type="text"
                    value={filterSupervisorAreaManager}
                    onChange={handleFilterSupervisorAreaManagerChange}
                    placeholder="Jefe Comercial"
                  />
                  <InputGroup.Text>
                    {filterSupervisorAreaManager ? (
                      <FaTimes
                        onClick={() => setFilterSupervisorAreaManager("")}
                      />
                    ) : (
                      <FaFilter />
                    )}
                  </InputGroup.Text>
                </InputGroup>
              </Col>

              <Col md={3}>
                <div className="my-1">
                  <ExcelExport data={handleExportToExcel()} fileName="dvr_controls" />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <DataTableBase
          columns={columns}
          data={filteredDvrControls}
          expandableRowsComponent={ExpandedComponent}
          expandableRows
        />
      </Col>

      <DvrControlFormModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setSelectedDvrControl(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedDvrControl}
      />
    </Row>
  );
};

DvrControl.propTypes = {
  data: PropTypes.array,
};

export default DvrControl;