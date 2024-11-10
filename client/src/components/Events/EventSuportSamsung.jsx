import {
    MdApps,
    MdRefresh,
    MdVideocam,
    MdCheck,
    MdCircle,
  } from "react-icons/md";
  import logoDarkSamsung from "../../assets/img/samsung_dark.png";
  import DarkModeContext from "../../contexts/DarkModeContext";
  import { useEffect, useState, useContext } from "react";
  import logoHikvision from "../../assets/img/hikvision.png";
  import { formatDate } from "../../utils/DateUtils";
  import DataTableBase from "../../utils/DataTable";
  import { eventsSuportSamsung, distinctNameSamsungCount } from "../../api/events";
  import { Alert } from "react-bootstrap";
  import PropsTypes from "prop-types";
  
  const EventSuportSamsung = () => {
    const [testsCountData, setTestsCountData] = useState(0);
    const [eventsData, setEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const darkMode = useContext(DarkModeContext);
  
    const fetchEventsData = async () => {
      setIsLoading(true);
      try {
        const data = await eventsSuportSamsung();
        setEventsData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    }
  
    useEffect(() => {
      const intervalId = setInterval(fetchEventsData, 5000);
      return () => clearInterval(intervalId);
  
    }, []);
  
    useEffect(() => {
      const fetchTestsHvCount = async () => {
        try {
          const data = await distinctNameSamsungCount();
          setTestsCountData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchTestsHvCount();
    }, []);
  
    const columns = [
      {
        cell: () => <MdApps style={{ fill: "#43a047" }} />,
        width: "50px",
        style: {
          marginBottom: "-1px",
        },
      },
      {
        name: "Id Samsung",
        selector: (row) => row.idEventSamsung,
        sortable: true,
      },
      {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
      },
      {
        name: "MAC Address",
        selector: (row) => row.macAddress,
        sortable: true,
      },
      {
        name: "Tipo Evento",
        selector: (row) => row.eventName,
        sortable: true,
      },
      {
        name: "Date Dvr",
        selector: (row) => formatDate(row.dateTime),
        sortable: true,
      },
      {
        name: "Observaciones",
        selector: (row) => row.observations,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
      },
      {
        name: "Created At",
        selector: (row) => formatDate(row.createdAt),
        sortable: true,
      },
    ];
  
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
  
    return (
      <>
        <div>
          <img
            className="m-2 float-end"
            src={darkMode ? logoDarkSamsung : logoHikvision}
            alt="Hikvision"
            width="100"
          />
          <h4 className="text-primary-emphasis m-2">
            Events Suport HikVision
            {isLoading && <MdRefresh className="spinner" />}
          </h4>
          <h6 className="my-3">
            <MdCircle className="text-success" />
            &nbsp; Connected Samsung DVR: {testsCountData}
          </h6>
        </div>
  
        <DataTableBase
          columns={columns}
          data={eventsData}
          paginationPerPage={10}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          selectableRows
        />
      </>
    );
  };
  
  EventSuportSamsung.propTypes = {
    data: PropsTypes.array,
  };
  
  export default EventSuportSamsung;
  