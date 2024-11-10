import logoHikvision from "../../assets/img/hikvision.png";
import { testHv, testCountHv } from "../../api/tests";
import { formatDate } from "../../utils/DateUtils";
import DataTableBase from "../../utils/DataTable";
import { useEffect, useState } from "react";
import { MdApps } from "react-icons/md";

const TestHikvision = () => {
  const [testsCountData, setTestsCountData] = useState(0);
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    const fetchTestsHvData = async () => {
      try {
        const data = await testHv();
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
        const data = await testCountHv();
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
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDate(row.date),
      sortable: true,
    },
  ];

  return (
    <>
      <img
        className="float-end m-2"
        src={logoHikvision}
        alt="Hikvision"
        width="100"
      />
      <h4 className="text-primary-emphasis m-2">
        Tests Hikvision: {testsCountData.count}
      </h4>
      <DataTableBase
        columns={columns}
        data={testData}
        paginationPerPage={5}
      />
    </>
  );
};

export default TestHikvision;
