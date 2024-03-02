fetch('http://localhost:3001/get-bitcoin-history')
  .then((response) => response.json())
  .then((json) => createChart(json))
  .catch((err) => console.log(err))


const createChart = (data) => {
  // console.log(data);
  const dataInfo = data.map((row) => parseFloat(row[4].replace(',', ''))).reverse();
  // console.log(dataInfo);
  data.reverse();
  let chart = new Chart(document.getElementById("chart"), {
    type: "bar",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    type: 'line',
    data: {
      labels: data.map((row) => row[0]),
      datasets: [
        {
          label: "Bitcoin Price History",
          data: dataInfo,
          backgroundColor: "#9721eb",
        },
      ],
    },
    options: {
      plugins: {
          tooltip: {
              callbacks: {
                  label: function(context) {
                      let label = '';

                      if (label) {
                          label += ': ';
                      }
                      if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                      }
                      return label;
                  }
              }
          }
      }
    }
  });
  return chart;
};
