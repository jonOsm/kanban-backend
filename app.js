var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var passport = require('./auth'); //better structure for this?
var flash = require('connect-flash');
var pgSession = require('connect-pg-simple')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/boards');
var authRouter = require('./routes/auth')
var app = express();

let pool = require('./db').getPool();
let store = new pgSession({
    pool: pool
}); //ugly, but from docs

app.use(logger('dev'));
app.use(express.json());
app.use(session({ secret: "cats", store: store }));
app.use(express.urlencoded({ extended: false }));   
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())

//gotta be a better way to set baseurl
app.use('/v0', indexRouter);
app.use('/v0/users', usersRouter);
app.use('/v0/boards', boardRouter);
app.use('/v0', authRouter);
module.exports = app;
