const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017');
const flash = require('connect-flash');
const session = require('cookie-session');
const methodOverride = require('method-override');
const cors = require('cors');

const app = express();
let time = new Date(Date.now() + (30 * 86400 + 1000));
let sess = {
  secret: 'keyboard_cat',
  cookie: { maxAge: time },
  resave: false,
  saveUninitialized: true,
};
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session(sess));
app.use(flash());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/', (req, res) => {
  res.render('index');
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
