const Crawler = require('crawler');
const puppeteer = require("puppeteer");

const walletURLs = ['https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9',
    'https://bitinfocharts.com/bitcoin/address/1ucXXZQSEf4zny2HRwAQKtVpkLPTUKRtt',
    'https://bitinfocharts.com/bitcoin/address/19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',
]

const bitcoinInfoURL = 'https://finance.yahoo.com/quote/BTC-USD/history';
let crawledWalletData = [];
let crawledBitcoinHistory = [];

const crawlBitcoinWallets = async () => {
    console.log('Crawling...');
    return new Promise((resolve, reject) => {
        const crawler = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page
            callback: (error, res, done) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    const $ = res.$;
                    const walletData = []
                    $('tr.trb').each(function () {
                        const tdData = [];
                        let isFirst = true;
                        $(this).find('td').each(function () {
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

const crawlBitcoinHistory = async (from, until) => {
    let isSpecificPeriod = false;
    if (from && until) {
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

    let interval = "1d";
    // Calculate the interval such that the if the value is greater than 2 years, the interval is 1 month, if it is greater than 3 months the interval is 1 week, otherwise the interval is 1 day
    if (value > 63158400) {
        interval = "1mo";
    } else if (!isSpecificPeriod || value > 8035200) {
        interval = "1wk";
    }
    url = isSpecificPeriod
        ? `${bitcoinInfoURL}?period1=${from}&period2=${until}&interval=${interval}&filter=history&frequency=${interval}&includeAdjustedClose=true`
        : `${bitcoinInfoURL}?interval=${interval}&filter=history&frequency=${interval}&includeAdjustedClose=true`;
    console.log('Interval: ' + interval);
    console.log(url)
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.NODE_ENV === 'production'
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    let retries = 0;

    await page.goto(url);

    await page.waitForSelector("table");

    while (retries < retryAmount) {
        await page.keyboard.press("PageDown");

        await new Promise((resolve) => setTimeout(resolve, 1));
        retries++;
    }

    const data = await page.evaluate(() => {
        const tableRows = Array.from(document.querySelectorAll("tr.BdT"));
        return tableRows.map((row) => {
            const cells = Array.from(row.querySelectorAll("td"));
            return cells.map((cell) => cell.innerText);
        });
    });

    data.pop();
    crawledBitcoinHistory = data;
    // console.log(crawledBitcoinHistory)
    await browser.close();

    return data;
}

const clearWalletData = () => {
    crawledWalletData = [];
}
const clearBitcoinData = () => {
    crawledBitcoinHistory = [];
}

module.exports = { crawledWalletData, crawlBitcoinWallets, crawledBitcoinHistory, crawlBitcoinHistory, clearWalletData, clearBitcoinData };