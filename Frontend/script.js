// import data from "./data/data.json" assert {type: 'json'};
// console.log(data);


const createTable = (data) => {
    const div = document.getElementById("data_table");
    console.log(data);
    
     let keys = Object.keys(data[0]);
     let table = `<table><tr class = "text-left">`;
     keys.forEach((key)=>{
        table += `<th class= "p-2">${key}</th>`;
     });
     table += `</tr>`;
       data.forEach((element,i) => {
        console.log(element);
         table += row(element, i);
       });
       table += `</table>`;
       div.innerHTML += table;
   }
   const row = (data , i) => {
    // complete tr string
    return `<tr class="text-left">
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.Block}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.Time}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} ${data.Amount.startsWith('+') ? "text-green-800" : "text-red-800" } border-gray-200">${data.Amount}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.Balance}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.Balance__1}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.USD_Price}</td>
    <td class="w-auto p-2 align-top border-b ${i===0 && ' border-t'} border-gray-200">${data.Profit}</td>
        </tr>`
  }  




fetch('./data/data.json')
.then((response) => response.json())
.then((json) => createTable(json))
.catch((err) => console.log(err))

// fetch(url) 
// .then((response) => {
//   console.log(response)
//   return response.text()
// })
// .then((v) => createTable(v))
// .catch((err) => console.log(err))
