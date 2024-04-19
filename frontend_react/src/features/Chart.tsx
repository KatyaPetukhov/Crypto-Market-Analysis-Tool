import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import InputDate from "../components/InputDate";
import Loading from "../components/Loading";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  GetGetBitcoinHistoryApiArg,
  useGetGetBitcoinHistoryQuery,
} from "../redux/Api";
import { useSelector } from "react-redux";
import { getSelectedTheme } from "../redux/PreferencesSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = "";

          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(context.parsed.y);
          }
          return label;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: '#6161614b', // change as needed
      },
    },
    y: {
      grid: {
        color: '#6161614b', // change as needed
      },
    },
  },
};

const emptyData = {
  labels: [],
  datasets: [
    {
      label: "Bitcoin Price History",
      data: [],
      backgroundColor: "#9721eb",
      borderWidth: 1,
      pointBorderWidth: 0,
      pointRadius: 4,
    },
  ],
};
const Chart = () => {
  
  const isDarkMode = useSelector(getSelectedTheme);

  const [apiArg, setApiArg] = useState<GetGetBitcoinHistoryApiArg>({});
  const [fromDate, setFromDate] = useState<Date>();
  const [untilDate, setUntilDate] = useState<Date>();
  const { isLoading, data, refetch, isFetching } = useGetGetBitcoinHistoryQuery(apiArg);
  const [chartData, setChartData] = useState<any>(emptyData);

  // Change the chart colors based on the theme
  useEffect(() => {
    if (isDarkMode) {
      setChartData((prevChartData: any) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            backgroundColor: "#818cf8",
            borderColor: "#bdbdbd",            
            color: "#ff0a0a",
          },
        ],
      }));
    } else {
      setChartData((prevChartData: any) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            backgroundColor: "#9721eb",
            borderColor: "#9c9c9c",
          },
        ],
      }));
    }
  }, [isDarkMode]);
  
  // Whenever the bitcoin history data changes, update the chart data
  useEffect(() => {
    function createChart() {
      if (data === undefined) return;
      const dataSet = data.map((row) =>
        parseFloat(row.Close.replace(",", ""))
      );
      const dataFinal = {
        labels: data.map((row) => row.Date),
        datasets: [
          {
            label: "Bitcoin Price History",
            data: dataSet,
          },
        ],
      };
      setChartData(dataFinal);
    }
    createChart();
  }, [data]);

  return (
    <section className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 my-6 dark:text-gray-200">
        Explore the Crypto World
      </h2>
      <div className="mx-auto flex flex-wrap items-end gap-6 mb-6">
        <div className=" dark:text-gray-100">
          From:
          <InputDate setDate={setFromDate} maxDate={untilDate} />
        </div>

        <div className=" dark:text-gray-100">
          Until:
          <InputDate setDate={setUntilDate} minDate={fromDate} />
        </div>
        <div>
          <Button
            name={"Update Data"}
            disabled={fromDate === undefined || untilDate === undefined}
            onClick={() => {
              if (fromDate === undefined || untilDate === undefined) return;
              setApiArg({
                from: Math.floor(fromDate.getTime() / 1000).toString(),
                until: Math.floor(untilDate.getTime() / 1000).toString(),
              });
              setTimeout(() => {
                refetch();
              }, 10);
            }}
          ></Button>
        </div>
      </div>
      <Loading isLoading={isLoading || isFetching} />
      <Line options={options} data={chartData} />
    </section>
  );
};

export default Chart;
