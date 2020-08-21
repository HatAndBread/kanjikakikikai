const express = require('express');
const compression = require('compression');
const session = require('express-session');
const NedbStore = require('connect-nedb-session')(session);
const passport = require('passport');
const flash = require('express-flash');
const favicon = require('serve-favicon');
const path = require('path');
require('dotenv').config();
const methodOverride = require('method-override'); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
const app = express();
const checkAuthenticated = require('./checkAuthenticated');

let PORT = process.env.PORT || 3000;
const login = require('./login');
const signup = require('./signup');
const addWords = require('./add-words');
const editWords = require('./edit-words');
const getWords = require('./get-words');
const about = require('./about');
const settings = require('./settings');
const getStrokes = require('./get-strokes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));
app.use(express.static('public'));
app.use(compression());
app.use(favicon(path.join(__dirname, 'public', 'assets', 'favicon.ico')));
app.use(express.json({ limit: '1mb' })); // FIX LIMIT!
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    failureFlash: true,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 3600 * 1000 // One year for example
    },
    store: new NedbStore({ filename: './persist.db' })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use('/login', login);
app.use('/signup', signup);
app.use('/add-words', addWords);
app.use('/edit-sets', editWords);
app.use('/get-words', getWords);
app.use('/about', about);
app.use('/settings', settings);
app.use('/get-strokes', getStrokes);

app.get('/', checkAuthenticated, (req, res) => {
  let userInfo = req.user;
  delete userInfo.password;

  res.render('index', { userInfo: userInfo });
});

app.get('/p5', (req, res) => {
  if (req.header('Accept-Encoding').includes('br')) {
    res.set('Content-Encoding', 'br');
    res.sendFile(path.join(__dirname, '/public', 'p5.min.js.br'));
    console.log('brotz');
  } else if (req.header('Accept-Encoding').includes('gzip')) {
    res.set('Content-Encoding', 'gzip');
    res.sendFile(path.join(__dirname, '/public', 'p5.min.js.gz'));
  } else {
    res.sendFile(path.join(__dirname, '/public', 'p5.min.js'));
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT);
