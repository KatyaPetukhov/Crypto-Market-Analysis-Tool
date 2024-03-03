const Crawler = require('crawler');
const walletURLs = ['https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9',];
// 'https://bitinfocharts.com/bitcoin/address/19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',]
const bitcoinInfoURL = 'https://finance.yahoo.com/quote/BTC-USD/history';
let crawledWalletData = [];
let crawledBitcoinHistory = [];

const crawlBitcoinWallets = () => {
    console.log('Crawling...');
    const crawler = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
            } else {                
                const $ = res.$;
                $('tr.trb').each(function() {
                    const tdData = [];
                    let isFirst = true;
                    $(this).find('td').each(function() {
                        if(isFirst) {
                            tdData.push($(this).text().split(' ')[0]);
                        } else {
                            tdData.push($(this).text());
                        }
                        isFirst = false;
                    });
                    crawledWalletData.push(tdData);
                });        
            }
            done();
        }
    });

    walletURLs.forEach(url => {
        crawler.queue(url);
    });
}

const crawlBitcoinHistory = (from, until) => {
    return new Promise((resolve, reject) => {
        const crawler = new Crawler({
            maxConnections: 10,
            // This will be called for each crawled page
            callback: (error, res, done) => {
                if (error) {
                    // console.log(error);
                    reject(error);
                } else {
                    const $ = res.$;
                    $('tr.BdT').each(function() {
                        const tdData = [];
                        $(this).find('td').each(function() {
                            // console.log($(this).text());
                            tdData.push($(this).text());
                        });
                        crawledBitcoinHistory.push(tdData);
                    });
                    crawledBitcoinHistory.pop();         
                    resolve(crawledBitcoinHistory);
                }
                done();
            }
        }); 
        if(from && until) {
            let url = `${bitcoinInfoURL}?period1=${from}&period2=${until}&interval=1d&filter=history&frequency=1d&includeAdjustedClose=true`;
            console.log(url);
            crawler.queue(url);
            // crawler.queue(`${bitcoinInfoURL}?from=${from}&until=${until}`);
        }
        else{
            console.log(bitcoinInfoURL)
            crawler.queue(bitcoinInfoURL);
            // crawler.queue(bitcoinInfoURL);
        }
    })
    
}

const clearWalletData = () => {
    crawledWalletData = [];
}
const clearBitcoinData = () => {
    crawledBitcoinHistory = [];
}

module.exports = { crawledWalletData, crawlBitcoinWallets, crawledBitcoinHistory, crawlBitcoinHistory, clearWalletData, clearBitcoinData };