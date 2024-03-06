
let chart = null;
let loading;
document.addEventListener('DOMContentLoaded', () => {
    const BACKEND_URL = 'https://crypto-market-analysis-tool-f12d66bb7184.herokuapp.com'
    loading = document.getElementById('loading');
    loading.classList.remove('invisible');
    loading.classList.add('block');

    fetch(`${BACKEND_URL}/get-bitcoin-history`)
    .then((response) => response.json())
    .then((json) => createChart(json))
    .catch((err) => console.log(err))
    
    const updateButton = document.getElementById('updateDatesBtn');
    const fromDateInput = document.getElementById('fromDateInput');
    const untilDateInput = document.getElementById('untilDateInput');
    setUpdateButtonDisabled(updateButton, true);
    updateButton.onclick = () => {
      const fromDate = new Date(fromDateInput.value);
      const untilDate = new Date(untilDateInput.value);
      const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
      const untilTimestamp = Math.floor(untilDate.getTime() / 1000);
      loading.classList.remove('invisible');
      loading.classList.add('block');
      fetch(`${BACKEND_URL}/get-bitcoin-history?from=${fromTimestamp}&until=${untilTimestamp}`)
      .then((response) => response.json())
      .then((json) => createChart(json))
      .catch((err) => console.log(err))
    };
    fromDateInput.onblur = () => {
      // console.log(fromDateInput.value);
      let fromDate = new Date(fromDateInput.value);
      let untilDate = new Date(untilDateInput.value);
      let now = new Date();
      let minDate = new Date('2014-09-17');
      if(fromDate === undefined) {
        setUpdateButtonDisabled(updateButton, true);
        return;
      }
      else if(untilDate !== undefined && fromDate !== undefined) {
        setUpdateButtonDisabled(updateButton, false);        
      }
      
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
      
      untilDateInput.onblur = () => {
        // console.log(untilDateInput.value);
        let fromDate = new Date(fromDateInput.value);
        let untilDate = new Date(untilDateInput.value);
        let now = new Date();
        let minDate = new Date('2014-09-17');
        if(untilDate === undefined) {
          setUpdateButtonDisabled(updateButton, true);
          return;
        }
        else if(untilDate !== undefined && fromDate !== undefined) {
          setUpdateButtonDisabled(updateButton, false);                
        }
        
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

const setUpdateButtonDisabled = (btn, isDisabled) => {
  btn.disabled = isDisabled;
  if (isDisabled) {
    btn.classList.remove('bg-blue-500');
    btn.classList.add('bg-gray-300');
  }
  else {
    btn.classList.remove('bg-gray-300');
    btn.classList.add('bg-blue-500');
  }
}

const createChart = (data) => {
  loading.classList.add('invisible');
  loading.classList.remove('block');
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
