import { Button } from "react-bootstrap";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const ExcelExport = ({ data, fileName }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <Button
      variant="success"
      className="w-100"
      size="sm"
      onClick={exportToExcel}
    >
      <FaFileExcel /> Excel
    </Button>
  );
};

ExcelExport.propTypes = {
  data: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default ExcelExport;
