import DataTable, { createTheme } from "react-data-table-component";
import { IoIosArrowDown } from "react-icons/io";
import LoaderDataTable from "./LoaderDataTable";
import useDarkMode from "../hooks/useDarkMode";
import { useEffect, useState } from "react";

createTheme(
  "myDarkTheme",
  {
    text: {
      primary: "#ffffff",
      secondary: "#d3d3d3",
    },
    background: {
      default: "#2b2d3",
    },
    context: {
      background: "#cb4b16",
      text: "#FFFFFF",
    },
    divider: {
      default: "#073642",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
    highlightOnHover: {
      default: "#21242b",
      text: "rgba(255,255,255,0.87)",
    },
  },
  "dark"
);

const DataTableBase = (props) => {
  const { darkMode } = useDarkMode();
  const sortIcon = <IoIosArrowDown />;
  const [pending, setPending] = useState(true);

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };


  useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <DataTable
      sortIcon={sortIcon}
      highlightOnHover
      pointerOnHover
      responsive
      progressPending={pending}
      progressComponent={<LoaderDataTable />}
      pagination
      paginationComponentOptions={paginationComponentOptions}
      paginationRowsPerPageOptions={[5, 10, 20, 50, 100]}
      theme={darkMode ? "myDarkTheme" : "default"}
      {...props}
    />
  );
}

export default DataTableBase;
