const Crawler = require('crawler');
const urls = ['https://bitinfocharts.com/bitcoin/address/3EMVdMehEq5SFipQ5UfbsfMsH223sSz9A9',];
    // 'https://bitinfocharts.com/bitcoin/address/19D5J8c59P2bAkWKvxSYw8scD3KUNWoZ1C',]
const crawledData = [];

const crawlBitcoinTables = () => {
    const crawler = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: (error, res, done) => {
            if (error) {
                console.log(error);
            } else {
                const $ = res.$;
                // console.log(res);
                // console.log($('table').eq(2).html());
                $('tr.trb').each(function() {
                    $(this).find('td').each(function() {
                        console.log($(this).text());
                    });
                    console.log('')
                });
                // const elements = $('tr.trb');
                // for (const key in elements) {
                //     console.log(key)
                // }
                // elements.for(element => {
                //     element.children.forEach(child => {
                //         console.log(child.innerHTML)
                //     });
                // });
                // console.log(elements)
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                console.log($('title').text());
            }
            done();
        }
    });

    urls.forEach(url => {
        crawler.queue(url);
    });
}

module.exports = {crawledData, crawlBitcoinTables};