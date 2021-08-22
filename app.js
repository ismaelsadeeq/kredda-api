var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
var cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.options('*', cors()) // include before other routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
require('./config/passport')(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var authRouter = require('./routes/auth');
var settingRouter = require('./routes/setting');
var kycRouter = require('./routes/kyc');
var investmentRouter = require('./routes/investment');
var loanRouter = require('./routes/loan')
var serviceRouter = require('./routes/service');
var creditCardRouter = require('./routes/creditCard');
var walletRouter = require('./routes/wallet');
var accountRouter = require('./routes/account');
var bankRouter = require('./routes/bank');
var servicesRouter = require('./routes/services');
var transactionRouter = require('./routes/transaction')

const cron = require('node-cron');
const helpers = require('./utilities/helpers');

app.use('/api/v1', indexRouter);
app.use('/api/v1',authRouter);
app.use('/api/v1/account', usersRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/setting',settingRouter);
app.use('/api/v1/kyc',kycRouter);
app.use('/api/v1/investment', investmentRouter);
app.use('/api/v1/loan', loanRouter);
app.use('/api/v1/service', serviceRouter);
app.use('/api/v1/services', servicesRouter)
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/credit-card', creditCardRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/bank', bankRouter);
app.use('/api/v1/transaction', transactionRouter);


cron.schedule('0 1 * * *', () => { //jobs will run after 1 am every day server is running
  helpers.checkLoans()
  helpers.checkInvestment()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
