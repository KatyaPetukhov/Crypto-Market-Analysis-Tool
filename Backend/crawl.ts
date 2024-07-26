// Gets data from different sources such as bitinfocharts and yahoofinance websites. 
// Using the crawler NPM package.
import Crawler from 'crawler';
import { BitcoinHistory, Transaction, WalletData } from './types';
import Papa from 'papaparse';
import { log } from 'console';

// The list of the sources for the wallets we use.
const walletURLs: string[] = [
    'https://bitinfocharts.com/bitcoin/address/bc1qjasf9z3h7w3jspkhtgatgpyvvzgpa2wwd2lr0eh5tx44reyn2k7sfc27a4-full',
    'https://bitinfocharts.com/bitcoin/address/1Ay8vMC7R1UbyCCZRVULMV7iQpHSAbguJP-full',
    'https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9-full',
    'https://bitinfocharts.com/bitcoin/address/39gUvGynQ7Re3i15G3J2gp9DEB9LnLFPMN-full',
    'https://bitinfocharts.com/bitcoin/address/bc1qcdqj2smprre85c78d942wx5tauw5n7uw92r7wr-full',
]

// The wallet data that was saved.
let crawledWalletData: WalletData[] = [];

//  Get bitcoin wallet data from the wallet list using the crawler by reading the HTML page and extracting data from it.
//  Returns a promise with a result.
const crawlBitcoinWallets = async (): Promise<WalletData[]> => {
    console.log('Crawling...');
    let count = 0;
    return new Promise((resolve, reject) => {
        const crawler = new Crawler({
            maxConnections: 10,
            callback: (error: Error, res: any, done: Function) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    const $ = res.$;
                    const walletData: any[] = []
                    //  The data saved in a table, so we use the apropriate classes to get the data. 
                    //  Loop over the rows in the table.
                    $('tr.trb').each(function (this: any) {
                        const tdData: any[] = [];
                        let isFirst = true;
                        $(this).find('td').each(function (this: any) {
                            //  The first cell in the row has hidden data that we don't need.
                            if (isFirst) {
                                tdData.push($(this).text().split(' ')[0]);
                            } else {
                                tdData.push($(this).text());
                            }
                            isFirst = false;
                        });
                        walletData.push(tdData);
                    });
                    const link = res.request.uri.href;
                    const names = link.split('/');
                    crawledWalletData.push({ link: link, name: names[names.length - 1], data: generateTransactions(walletData) });
                    count++;
                    
                    if ( count == walletURLs.length){
                        resolve(crawledWalletData);
                        
                    }
                   
                }
                done();

            }
        });
        //  Add all the wallet URLs to the crawler queue.
        walletURLs.forEach(url => {
            crawler.queue(url);
        });
    });
}


function generateTransactions(data:string[][]) : Transaction[] {
    let transactions: Transaction[] = [];
    data.forEach(transaction => {
        let t = {
            block: transaction[0],
            time: createTimezoneDate(transaction[1]),
            amount: transaction[2],
            balance: transaction[3],
            balanceUSD: transaction[4],
            profit: transaction[5],
        };
        transactions.push(t);
    });
    return transactions;
}


function createTimezoneDate(dateOld: string){
    const date = new Date(dateOld)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset * Math.sign(userTimezoneOffset));
}

// Get the bitcoin history data from Yahoo Finance as a CSV file, parse the result and return it.
// If the from and until are provided we use them, otherwise we use default values.
const crawlBitcoinHistory = async (from?: number, until?: number): Promise<BitcoinHistory[]> => {
    let isSpecificPeriod = false;
    if (from && until) {
        isSpecificPeriod = true;
    }
    const minimum = 2678400;
    const maximum = 298512000;
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    const fromTimestamp = Math.floor(oneYearAgo.getTime() / 1000);
    const untilTimestamp = Math.floor(currentDate.getTime() / 1000);
    from = from || fromTimestamp;
    until = until || untilTimestamp;
    const value = isSpecificPeriod ? ((until || maximum) - (from || minimum)) : minimum;

    //  The API allows us to change the amount of points we get, either one point per day, one per week, one per month.
    //  We choose based on the amount of time between the dates.

    let interval = "1d";
    if (value > 63158400) {
        interval = "1mo";
    } else if (!isSpecificPeriod || value > 8035200) {
        interval = "1wk";
    }

    // The URL to download the data as CSV file. 

    const yahooDownloadURL = `https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=${from}&period2=${until}&interval=${interval}&events=history&includeAdjustedClose=true`
    const result = await fetch(yahooDownloadURL);
    const data = await result.text();

    // Use papa parse to parse the CSV file into bitcion history array.

    const parsedCSV = Papa.parse<BitcoinHistory>(data, { header: true });
    return parsedCSV.data;
}

//  Clear all the data from array.

const clearWalletData = (): void => {
    crawledWalletData = [];
}

export { crawledWalletData, crawlBitcoinWallets, crawlBitcoinHistory, clearWalletData };