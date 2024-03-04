var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { crawledWalletData, crawlBitcoinWallets,
  crawledBitcoinHistory, crawlBitcoinHistory,
  clearWalletData, clearBitcoinData } = require('./crawl');
let defaultBitcoinHistory;
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const cors = require('cors');
app.use(cors());

app.get('/get-wallet-data', (req, res) => {
  res.send(crawledWalletData);
});
app.get('/get-bitcoin-history', async (req, res) => {
  const from = req.query.from;
  const until = req.query.until;
  if(from && until)
  {
    console.log(until - from)
    console.log("Crawling bitcoin history")
    clearBitcoinData();
    crawlBitcoinHistory(from, until)
      .then((data) => {res.send(data); return;})
      .catch((err) => { console.log(err); res.send("ERROR"); return; })
  }
  else{
    console.log("Sending bitcoin history")
    // console.log(defaultBitcoinHistory)
    res.send(defaultBitcoinHistory);
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

crawlBitcoinWallets();
crawlBitcoinHistory().then((data) => { defaultBitcoinHistory = data; });
setInterval(() => { clearWalletData(); crawlBitcoinWallets(); }, 15 * 60 * 1000);
setInterval(() => { clearBitcoinData(); crawlBitcoinHistory().then((data) => { defaultBitcoinHistory = data; }); }, 15 * 60 * 1000);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

module.exports = app;
