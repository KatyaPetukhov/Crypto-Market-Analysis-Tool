// Getting wallet data from CSV.

import { Transaction, WalletData } from "./types";
import Papa from "papaparse";
//import Crawler from 'crawler';

const fs = require("fs");

// // The list of the sources for the wallets we use.
// const walletURLs: string[] = [
//     'https://bitinfocharts.com/bitcoin/address/bc1qjasf9z3h7w3jspkhtgatgpyvvzgpa2wwd2lr0eh5tx44reyn2k7sfc27a4-full',
//     'https://bitinfocharts.com/bitcoin/address/1Ay8vMC7R1UbyCCZRVULMV7iQpHSAbguJP-full',
//     'https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9-full',
//     'https://bitinfocharts.com/bitcoin/address/bc1qcdqj2smprre85c78d942wx5tauw5n7uw92r7wr-full',
//     'https://bitinfocharts.com/bitcoin/address/39gUvGynQ7Re3i15G3J2gp9DEB9LnLFPMN-full',
//       'https://bitinfocharts.com/bitcoin/address/15cHRgVrGKz7qp2JL2N5mkB2MCFGLcnHxv-full,
// ]
const createBitcoinWallets = (dir: string = "./walletsCSV"): WalletData[] => {
  const savedCsvNames = getFiles(dir);
  const walletData: WalletData[] = [];
  for (let i = 0; i < savedCsvNames.length; i++) {
    const csvFile = fs.readFileSync(savedCsvNames[i], "utf8");
    const parsedCSV = Papa.parse<Transaction>(csvFile, {
      header: true,
      delimiter: "|",
    });
    const name = savedCsvNames[i].split("/")[2].split(".")[0];
    walletData.push({
      name: name,
      link: `https://bitinfocharts.com/bitcoin/address/${name}-full`,
      data: generateTransactions(parsedCSV.data),
    });
  }

  return walletData;
};

function getFiles(dir: string, files: string[] = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    files.push(name);
  }
  return files;
}

function generateTransactions(data: Transaction[]): Transaction[] {
  let transactions: Transaction[] = [];
  data.forEach((transaction) => {
    let t = {
      block: transaction.block,
      time: createTimezoneDate(transaction.time),
      amount: transaction.amount,
      balance: transaction.balance,
      balanceUSD: transaction.balanceUSD,
      profit: transaction.profit,
    };
    transactions.push(t);
  });
  return transactions;
}

function createTimezoneDate(dateOld: Date) {
  const newDate = new Date(dateOld);
  const userTimezoneOffset = newDate.getTimezoneOffset() * 60000;
  return new Date(
    newDate.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset)
  );
}

//-------------------The WebSite BitInfoCharts added the capcha.
//------------------- We can not use the code below.

// The wallet data that was saved.
// let crawledWalletData: WalletData[] = [];

// //  Get bitcoin wallet data from the wallet list using the crawler by reading the HTML page and extracting data from it.
// //  Returns a promise with a result.
// const crawlBitcoinWallets = async (): Promise<WalletData[]> => {
//     console.log('Crawling...');
//     let count = 0;
//     return new Promise((resolve, reject) => {
//         const crawler = new Crawler({
//             maxConnections: 10,
//             callback: (error: Error, res: any, done: Function) => {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     const $ = res.$;

//                     const walletData: any[] = []
//                     //  The data saved in a table, so we use the apropriate classes to get the data.
//                     //  Loop over the rows in the table.
//                     const row = $('tr.trb')
//                     $('tr.trb').each(function (this: any) {
//                         const tdData: any[] = [];
//                         let isFirst = true;
//                         $(this).find('td').each(function (this: any) {
//                             //  The first cell in the row has hidden data that we don't need.
//                             if (isFirst) {
//                                 tdData.push($(this).text().split(' ')[0]);
//                             } else {
//                                 tdData.push($(this).text());
//                             }
//                             isFirst = false;
//                         });
//                         walletData.push(tdData);
//                     });
//                     const link = res.request.uri.href;
//                     const names = link.split('/');
//                     let walletTest = { link: link, name: names[names.length - 1], data: generateTransactions(walletData) };
//                     crawledWalletData.push({ link: link, name: names[names.length - 1], data: generateTransactions(walletData) });
//                     count++;

//                     if ( count == walletURLs.length){
//                         resolve(crawledWalletData);

//                     }

//                 }
//                 done();

//             }
//         });
//         //  Add all the wallet URLs to the crawler queue.
//         walletURLs.forEach(url => {
//             crawler.queue(url);
//         });
//     });
// }

// function generateTransactions(data:string[][]) : Transaction[] {
//     let transactions: Transaction[] = [];
//     data.forEach(transaction => {
//         let t = {
//             block: transaction[0],
//             time: createTimezoneDate(transaction[1]),
//             amount: transaction[2],
//             balance: transaction[3],
//             balanceUSD: transaction[4],
//             profit: transaction[5],
//         };
//         transactions.push(t);
//     });
//     return transactions;
// }

// function createTimezoneDate(dateOld: string){
//     const date = new Date(dateOld)
//     const userTimezoneOffset = date.getTimezoneOffset() * 60000;
//     return new Date(date.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset));
// }

export { createBitcoinWallets };
