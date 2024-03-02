var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { crawledData, crawlBitcoinTables } = require('./crawl');

var expressApp = express();
crawlBitcoinTables();
// view engine setup
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'jade');

expressApp.use(logger('dev'));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__dirname, 'public')));

expressApp.use('/', indexRouter);
expressApp.use('/users', usersRouter);

// catch 404 and forward to error handler
expressApp.use(function(req, res, next) {
  next(createError(404));
});

// error handler
expressApp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
expressApp.get('/crawl', (req, res) => {
  res.send(crawledData);
});
module.exports = expressApp;
