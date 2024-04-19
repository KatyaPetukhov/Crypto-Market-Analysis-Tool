import Crawler from 'crawler';
import puppeteer, { Browser, Page } from "puppeteer";
import { BitcoinHistory, WalletData } from './types';
import Papa from 'papaparse';

const walletURLs: string[] = [
    'https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9',
    'https://bitinfocharts.com/bitcoin/address/1ucXXZQSEf4zny2HRwAQKtVpkLPTUKRtt',
    'https://bitinfocharts.com/bitcoin/address/19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',
]

const bitcoinInfoURL: string = 'https://finance.yahoo.com/quote/BTC-USD/history';
let crawledWalletData: WalletData[] = [];
let crawledBitcoinHistory: any[] = [];

const crawlBitcoinWallets = async (): Promise<WalletData[]> => {
    console.log('Crawling...');
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
                    $('tr.trb').each(function (this: any) {
                        const tdData: any[] = [];
                        let isFirst = true;
                        $(this).find('td').each(function (this: any) {
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
                    crawledWalletData.push({ link: link, name: names[names.length - 1], data: walletData });
                    resolve(crawledWalletData);
                }
                done();
            }
        });

        walletURLs.forEach(url => {
            crawler.queue(url);
        });
    });
}

const crawlBitcoinHistory = async (from?: number, until?: number, tries: number = 0): Promise<BitcoinHistory[]> => {
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

    let interval = "1d";
    if (value > 63158400) {
        interval = "1mo";
    } else if (!isSpecificPeriod || value > 8035200) {
        interval = "1wk";
    }
    // let url = isSpecificPeriod
    //     ? `${bitcoinInfoURL}?period1=${from}&period2=${until}&interval=${interval}&filter=history&frequency=${interval}&includeAdjustedClose=true`
    //     : `${bitcoinInfoURL}?interval=${interval}&filter=history&frequency=${interval}&includeAdjustedClose=true`;
    const newURL = `https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=${from}&period2=${until}&interval=${interval}&events=history&includeAdjustedClose=true`
    const result = await fetch(newURL);
    const data = await result.text();
    const parsedCSV = Papa.parse<BitcoinHistory>(data, { header: true });
    return parsedCSV.data;
    // try {        
    //     const browser: Browser = await puppeteer.launch({
    //         args: ["--no-sandbox", "--disable-setuid-sandbox"],
    //         executablePath: process.env.NODE_ENV === 'production'
    //             ? process.env.PUPPETEER_EXECUTABLE_PATH
    //             : puppeteer.executablePath(),
    //     });
    //     const page: Page = await browser.newPage();
    //     let retries = 0;
    
    //     await page.goto(url);
    
    //     await page.waitForSelector("table");
    
    //     while (retries < retryAmount) {
    //         await page.keyboard.press("PageDown");
    
    //         await new Promise((resolve) => setTimeout(resolve, 1));
    //         retries++;
    //     }
    
    //     const data = await page.evaluate(() => {
    //         const tableRows = Array.from(document.querySelectorAll("tr.BdT"));
    //         return tableRows.map((row) => {
    //             const cells = Array.from(row.querySelectorAll("td"));
    //             return cells.map((cell) => cell.innerText);
    //         });
    //     });
    
    //     data.pop();
    //     crawledBitcoinHistory = data;
    //     await browser.close();
    
    //     return data;
    // } catch (error) {
    //     console.log('Failed to crawl with puppeteer, trying again...');
    //     console.log(error);
    //     if(tries < 5)
    //         return crawlBitcoinHistory(from, until, tries + 1);
    //     return [];
    // }
}

const clearWalletData = (): void => {
    crawledWalletData = [];
}
const clearBitcoinData = (): void => {
    crawledBitcoinHistory = [];
}

export { crawledWalletData, crawlBitcoinWallets, crawledBitcoinHistory, crawlBitcoinHistory, clearWalletData, clearBitcoinData };