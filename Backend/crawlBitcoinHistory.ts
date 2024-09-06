// Gets data from different sources such as bitinfocharts and yahoofinance websites.
// Using the crawler NPM package.
import { BitcoinHistory } from "./types";
import Papa from "papaparse";
const fs = require("fs");

// Get the bitcoin history data from Yahoo Finance as a CSV file, parse the result and return it.
// If the from and until are provided we use them, otherwise we use default values.
const crawlBitcoinHistory = async (
  from?: number,
  until?: number,
  forceOneDay?: boolean
): Promise<BitcoinHistory[]> => {
  let isSpecificPeriod = false;
  if (from && until) {
    isSpecificPeriod = true;
  }
  const minimum = 2678400;
  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const fromTimestamp = Math.floor(oneYearAgo.getTime() / 1000);
  const untilTimestamp = Math.floor(currentDate.getTime() / 1000);
  from = from || fromTimestamp;
  until = until || untilTimestamp;
  const value = isSpecificPeriod ? until - (from || minimum) : minimum;

  //  The API allows us to change the amount of points we get, either one point per day, one per week, one per month.
  //  We choose based on the amount of time between the dates.

  let interval = "1d";
  if (forceOneDay === undefined || forceOneDay === false) {
    if (value > 63158400) {
      interval = "1mo";
    } else if (!isSpecificPeriod || value > 8035200) {
      interval = "1wk";
    }
  }

  // The URL to download the data as CSV file.

  const yahooDownloadURL = `https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=${from}&period2=${until}&interval=${interval}&events=history&includeAdjustedClose=true`;
  const result = await fetch(yahooDownloadURL);
  const data = await result.text();

  // Use papa parse to parse the CSV file into bitcion history array.

  const parsedCSV = Papa.parse<BitcoinHistory>(data, { header: true });
  return parsedCSV.data;
};

function readBitcoinHistory(fileName: string) {
  const csvFile = fs.readFileSync(fileName, "utf8");
  const parsedCSV = Papa.parse<BitcoinHistory>(csvFile, {
    header: true,
    delimiter: "|",
  });
  return parsedCSV.data;
}

export { crawlBitcoinHistory, readBitcoinHistory };
