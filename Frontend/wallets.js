const BACKEND_URL = 'https://crypto-market-analysis-tool-f12d66bb7184.herokuapp.com'
// console.log(data);
let currentIndex = 0;
let wallets = [];

document.addEventListener('DOMContentLoaded', () => {
  const walletSelect = document.getElementById('walletSelect');
  const walletLink = document.getElementById('walletLink');
  walletLink.href = "https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9";
  walletSelect.onchange = () => {
    currentIndex = walletSelect.value;
    walletLink.href = wallets[currentIndex].link;
    const div = document.getElementById("data_table");
    div.innerHTML = "";
    createTable();
  };
});
const setData = (data) => {
  wallets = data;
  walletLink.href = wallets[0].link;
  for (let i = 0; i < wallets.length; i++) {
    walletSelect.appendChild(new Option(`Wallet ${i + 1}: ${wallets[i].name}`, i));
  }
  createTable();
}
const createTable = () => {
    const div = document.getElementById("data_table");
    console.log(wallets);
    
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
       wallets[currentIndex].data.forEach((element,i) => {
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

fetch(`${BACKEND_URL}/get-wallet-data`)
  .then((response) => response.json())
  .then((json) => setData(json))
  .catch((err) => console.log(err))

