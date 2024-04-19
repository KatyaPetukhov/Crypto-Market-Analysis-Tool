import Crawler from 'crawler';
import { BitcoinHistory, WalletData } from './types';
import Papa from 'papaparse';

const walletURLs: string[] = [
    'https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9',
    'https://bitinfocharts.com/bitcoin/address/1ucXXZQSEf4zny2HRwAQKtVpkLPTUKRtt',
    'https://bitinfocharts.com/bitcoin/address/19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',
]

let crawledWalletData: WalletData[] = [];

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

// Get the bitcoin history data from Yahoo Finance as a CSV file, parse the result and return it.
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

    let interval = "1d";
    if (value > 63158400) {
        interval = "1mo";
    } else if (!isSpecificPeriod || value > 8035200) {
        interval = "1wk";
    }

    const yahooDownloadURL = `https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=${from}&period2=${until}&interval=${interval}&events=history&includeAdjustedClose=true`
    const result = await fetch(yahooDownloadURL);
    const data = await result.text();
    const parsedCSV = Papa.parse<BitcoinHistory>(data, { header: true });
    return parsedCSV.data;
}

const clearWalletData = (): void => {
    crawledWalletData = [];
}

export { crawledWalletData, crawlBitcoinWallets, crawlBitcoinHistory, clearWalletData };