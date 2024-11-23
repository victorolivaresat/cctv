import { eventsSamsungDataChart } from "../../api/events";
import  useDarkMode from "../../hooks/useDarkMode";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";

const ChartSamsungEvent = () => {
  const darkMode = useDarkMode;

  const getOptions = (darkMode) => {
    const background = darkMode ? "#323949" : "#fff";
    const mode = darkMode ? "dark" : "light";
    const color = darkMode ? "#fff" : "#000";

    return {
      chart: {
        id: "basic-bar",
        stacked: true,
        toolbar: {
          show: true,
        },
        background,
      },
      xaxis: {
        categories: [],
        labels: {
          rotate: -90,
        },
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                color: color,
              },
            },
          },
        },
      },
      grid: {
        borderColor: darkMode ? "#404b4f" : "#e0e0e0",
      },
      theme: {
        mode,
        palette: "palette2",
        monochrome: {
          enabled: false,
          color: "#255aee",
          shadeTo: "dark",
          shadeIntensity: 0.65,
        },
      },
      legend: {
        position: "top",
      },
      title: {
        text: " Analysis of Events",
        align: "left",
      },
      subtitle: {
        text: " Hikvision Events for the last 30 days",
        align: "left",
      },
    };
  };

  const [state, setState] = useState({
    options: getOptions(darkMode),
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const newOptions = getOptions(darkMode);
      const data = await eventsSamsungDataChart();
      const categories = [...new Set(data.map((item) => item.name))];
      const eventTypes = [...new Set(data.map((item) => item.event_type))];
  
      const series = eventTypes.map((type) => {
        return {
          name: type,
          data: categories.map((category) => {
            const item = data.find(
              (item) => item.name === category && item.event_type === type
            );
            return item ? Number(item.event_count) : 0;
          }),
        };
      });
  
      setState((prevState) => ({
        ...prevState,
        options: {
          ...newOptions,
          xaxis: {
            ...newOptions.xaxis,
            categories,
          },
          chart: {
            ...newOptions.chart,
            background: darkMode ? "#323949" : "#fff",
          },
          theme: {
            ...newOptions.theme,
            mode: darkMode ? "dark" : "light",
          },
          plotOptions: {
            ...newOptions.plotOptions,
            bar: {
              ...newOptions.plotOptions.bar,
              dataLabels: {
                total: {
                  enabled: true,
                  style: {
                    color: darkMode ? "#fff" : "#000",
                  },
                },
              },
            },
          },
          grid: {
            ...newOptions.grid,
            borderColor: darkMode ? "#404b4f" : "#e0e0e0",
          },
        },
        series,
      }));
    };
  
    fetchData();

  }, [darkMode]);

  return (
    <>
      <Card className="shadow">
        <Card.Body>
          <Card.Text>Eventos Hikvision</Card.Text>
          <Chart options={state.options} series={state.series} type="bar" height={400} />
        </Card.Body>
      </Card>
    </>
  );
};

export default ChartSamsungEvent;
