
import { FaCheck, FaTimes } from "react-icons/fa";
import { GrConfigure } from "react-icons/gr";
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import PropTypes from "prop-types";

const StatusPieChart = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState([]);

  // Pie chart options
  const [chartOptions, setChartOptions] = useState({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [],
      legend: {
        show: false,
      },
      theme: {
        palette: "palette7",
      },
      responsive: [
        {// Extra small devices (portrait phones, less than 576px)
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setStatusCounts(data);
        console.log(data);
        const labels = data.map((item) => item.status);
        const series = data.map((item) => item.count);

        setChartOptions((prevOptions) => ({
          ...prevOptions,
          series: series,
          options: {
            ...prevOptions.options,
            labels: labels,
          },
        }));
      } catch (error) {
        console.error("Error fetching status counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [data]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="my-3">
      <p className="bg-body-tertiary px-2 py-1 rounded-3">
        <GrConfigure className="me-2" />
        Estado de configuraciones
      </p>
      {statusCounts.length > 0 ? (
        <>
          <Chart
            options={chartOptions.options}
            series={chartOptions.series}
            type="pie"
          />
          <div>
            <table className="my-2 table table-striped">
              <tbody>
                {statusCounts.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.status === "Activo" ? (
                        <FaCheck className="text-success me-2" />
                      ) : (
                        <FaTimes className="text-danger me-2" />
                      )}{" "}
                      {item.status}
                    </td>
                    <td> {item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Sin información</p>
      )}
    </div>
  );
};

StatusPieChart.propTypes = {
  data : PropTypes.array.isRequired
};


export default StatusPieChart;
