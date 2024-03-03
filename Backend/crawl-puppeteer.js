const puppeteer = require("puppeteer");

const scrapeTable = async (url, from, until) => {
  let isSpecificPeriod = false;
  if (front && until) {
    isSpecificPeriod = true;
  }

  // minimum - month: 2678400
  // maximum - all time: 298512000
  const minimum = 2678400;
  const maximum = 298512000;
  const value = isSpecificPeriod ? until - from : minimum;
  const retryAmount = isSpecificPeriod
    ? Math.max(((value - minimum) * (700 - 100)) / (maximum - minimum), 0) + 100
    : 100;
  url = isSpecificPeriod ? `${bitcoinInfoURL}?period1=${from}&period2=${until}&interval=1d&filter=history&frequency=1d&includeAdjustedClose=true` : bitcoinInfoURL;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector("table");

//   let previousHeight = 0;
//   let currentHeight = await page.evaluate(() => document.body.scrollHeight);
  let retries = 0;

  while (retries < retryAmount) {
    // console.log('scrolling');
    // previousHeight = currentHeight;

    await page.keyboard.press("PageDown");

    // Add delay here
    await new Promise((resolve) => setTimeout(resolve, 1)); // wait for 1 second

    retries++;
    // currentHeight = await page.evaluate(() => document.body.scrollHeight);

    // if (previousHeight === currentHeight) {
    //     retries++;
    // } else {
    //     retries = 0;
    // }
  }

  const data = await page.evaluate(() => {
    const tableRows = Array.from(document.querySelectorAll("tr.BdT"));
    return tableRows.map((row) => {
      const cells = Array.from(row.querySelectorAll("td"));
      return cells.map((cell) => cell.innerText);
    });
  });

  console.log(data[data.length - 2]);

  await browser.close();

  return data;
};

module.exports = scrapeTable;



//  OLD CODE
// const crawlBitcoinHistory = (from, until) => {
//     return new Promise((resolve, reject) => {
//         const crawler = new Crawler({
//             maxConnections: 10,
//             // This will be called for each crawled page
//             callback: (error, res, done) => {
//                 if (error) {
//                     // console.log(error);
//                     reject(error);
//                 } else {
//                     const $ = res.$;
//                     $('tr.BdT').each(function() {
//                         const tdData = [];
//                         $(this).find('td').each(function() {
//                             // console.log($(this).text());
//                             tdData.push($(this).text());
//                         });
//                         crawledBitcoinHistory.push(tdData);
//                     });
//                     crawledBitcoinHistory.pop();         
//                     resolve(crawledBitcoinHistory);
//                 }
//                 done();
//             }
//         }); 
//         if(from && until) {
//             let url = `${bitcoinInfoURL}?period1=${from}&period2=${until}&interval=1d&filter=history&frequency=1d&includeAdjustedClose=true`;
//             console.log(url);
//             crawler.queue(url);
//             // crawler.queue(`${bitcoinInfoURL}?from=${from}&until=${until}`);
//         }
//         else{
//             console.log(bitcoinInfoURL)
//             crawler.queue(bitcoinInfoURL);
//             // crawler.queue(bitcoinInfoURL);
//         }
//     })
// }
