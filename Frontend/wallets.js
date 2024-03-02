// import data from "./data/data.json" assert {type: 'json'};
// console.log(data);


const createTable = (data) => {
    const div = document.getElementById("data_table");
    // console.log(data);
    
     let table = `<table><tr class = "text-left">`;
     table += `
     <th class= "p-2">Block</th>
     <th class= "p-2">Time</th>
     <th class= "p-2">Amount</th>
     <th class= "p-2">Balance</th>
     <th class= "p-2">Balance USD</th>
     <th class= "p-2">Profit</th>
     `;
     table += `</tr>`;
       data.forEach((element,i) => {
        // console.log(element);
         table += row(element, i);
       });
       table += `</table>`;
       div.innerHTML += table;
   }
   const row = (data , i) => {
    // complete tr string
    return `<tr class="text-left">
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data[0]}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data[1]}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} ${data[2].startsWith('+') ? "text-green-800" : "text-red-800" } border-gray-200">${data[2]}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data[3]}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data[4]}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data[5]}</td>
        </tr>`
  }  

// fetch('./data/data.json')
fetch('http://localhost:3001/get-wallet-data')
  .then((response) => response.json())
  .then((json) => createTable(json))
  .catch((err) => console.log(err))

