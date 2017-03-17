/**----------------------------------------------------------------------
 * @author:  Darin Dieckhoff
 * Date:    March 16, 2017
 *
 * Project Info:
 * You've been tasked with creating a library management system for a small library. 
 * The librarian has been using a simple sqlite database and has been entering data in manually. 
 * The librarian wants a more intuitive way to handle the library's books, patrons and loans.
 * You'll be given static HTML designs, a set of requirements and the existing SQLite database. 
 * You'll be required to implement a dynamic website in Express and a SQL ORM, Sequelize.

 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var books = require('./routes/books');
var loans = require('./routes/loans');
var patrons = require('./routes/patrons');

var app = express();
//momentjs for date formatting
app.locals.moment = require('moment');
//local function for capitalizing first letter and removing underscore from column names
app.locals.ucfirst = function(value) {
  if (value.includes('_')) {
    value = value.replace('_', ' ');
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/book', books);
app.use('/loan', loans);
app.use('/patron', patrons);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
