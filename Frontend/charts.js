fetch('http://localhost:3001/get-bitcoin-history')
  .then((response) => response.json())
  .then((json) => createChart(json))
  .catch((err) => console.log(err))

let chart = null;

  document.addEventListener('DOMContentLoaded', () => {
    const updateButton = document.getElementById('updateDatesBtn');
    const fromDateInput = document.getElementById('fromDateInput');
    const untilDateInput = document.getElementById('untilDateInput');
    updateButton.onclick = () => {
      const fromDate = new Date(fromDateInput.value);
      const untilDate = new Date(untilDateInput.value);
      const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
      const untilTimestamp = Math.floor(untilDate.getTime() / 1000);
      fetch(`http://localhost:3001/get-bitcoin-history?from=${fromTimestamp}&until=${untilTimestamp}`)
        .then((response) => response.json())
        .then((json) => createChart(json))
        .catch((err) => console.log(err))
    };
    fromDateInput.onchange = () => {
      console.log(fromDateInput.value);
      let fromDate = new Date(fromDateInput.value);
      let untilDate = new Date(untilDateInput.value);
      let now = new Date();
      let minDate = new Date('2014-09-17');
  
      if (fromDate > untilDate) {
          untilDateInput.value = fromDateInput.value;
      }
      else if (fromDate > now) {
          fromDateInput.value = now.toISOString().split('T')[0];
      }
      else if (fromDate < minDate) {
          fromDateInput.value = minDate.toISOString().split('T')[0];
      }
  };
  
  untilDateInput.onchange = () => {
      console.log(untilDateInput.value);
      let fromDate = new Date(fromDateInput.value);
      let untilDate = new Date(untilDateInput.value);
      let now = new Date();
      let minDate = new Date('2014-09-17');
  
      if (untilDate < fromDate) {
          untilDateInput.value = fromDateInput.value;
      }
      else if (untilDate > now) {
          untilDateInput.value = now.toISOString().split('T')[0];
      }
      else if (untilDate < minDate) {
          untilDateInput.value = minDate.toISOString().split('T')[0];
      }
  };
  });

  

const createChart = (data) => {
  const dataInfo = data.map((row) => parseFloat(row[4].replace(',', ''))).reverse();
  console.log(data.toReversed());
  data.reverse();
  if(chart !== null)
  {
    chart.destroy();
    chart = null;
  } 
  chart = new Chart(document.getElementById("chart"), {
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
  
};
