import { testSamsung, testCountSamsung } from "../../api/tests";
import logoSamsung from "../../assets/img/samsung.png";
import { formatDate } from "../../utils/DateUtils";
import DataTableBase from "../../utils/DataTable";
import { useEffect, useState } from "react";
import { MdApps } from "react-icons/md";

const TestSamsung = () => {
  const [testsCountData, setTestsCountData] = useState(0);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchTestsHvData = async () => {
      try {
        const data = await testSamsung();
        setTestData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTestsHvData();
  }, []);

  useEffect(() => {
    const fetchTestsHvCount = async () => {
      try {
        const data = await testCountSamsung();
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
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Mac Address",
      selector: (row) => row.macAddress,
      sortable: true,
    },
    {
      name: "Event Name",
      selector: (row) => row.eventName,
      sortable: true,
    },

    {
      name: "Date",
      selector: (row) => formatDate(row.datetime),
      sortable: true,
    },
  ];

  return (
    <>
      <img
        className="float-end m-2"
        src={logoSamsung}
        alt="Hikvision"
        width="100"
      />
      <h4 className="text-primary-emphasis m-2">
        Tests Samsung: {testsCountData.count}
      </h4>
      <DataTableBase
        columns={columns}
        data={testData}
        paginationPerPage={5}
      />
    </>
  );
};

export default TestSamsung;
