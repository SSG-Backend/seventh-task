var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

var mongoose = require('mongoose');
var db = require('./config/keys').MongoURI;
const User = require('./models/User');
const bcrypt = require('bcryptjs');


var indexRouter = require('./routes/index');
var bookRouter = require('./routes/book');
var userRouter = require('./routes/users');
var dashRouter = require('./routes/dashboard');


var app = express();


// Connect to DB
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDb Connected...'))
.catch(err => console.log(err));


// view engine setup
app.use(expressLayouts);
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
  secret: 'digbanko',
  resave: true,
  saveUninitialized: true
}));


// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

function auth(req, res, next) {
  var authHeader = req.headers.authorization;

  if (!authHeader) {
    var err = new Error('You are not authenticated');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  // var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
  var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  var email = auth[0];
  var password = auth[1];

  // Match user
  User.findOne({ email: email })
  .then(user => {
      if(!user) {
          // return next(err);
          // next(createError(404));
          var err = new Error('You are not authenticated');

          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
          // if(err) throw err;
          if(err) next(createError(404));

          if(isMatch) {
              next();
          } else {
              var err = new Error('You are not authenticated');

              res.setHeader('WWW-Authenticate', 'Basic');
              err.status = 401;
              return next(err);
          }
          
      });
  })
  .catch(err => {console.log(err)
    next(err);
  });


}


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);

app.use(auth);
app.use('/dashboard', dashRouter);
app.use('/book', bookRouter);


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
  console.log(err);
  res.status(err.status || 500);
  res.json({error: 'There was an error.'});
});

module.exports = app;

