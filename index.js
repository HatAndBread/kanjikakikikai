const express = require('express');
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

const fs = require('fs'); // delete me!

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

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.post('/send-jason', (req, res) => {
  const data = req.body;
  const jason = JSON.stringify(data);
  fs.writeFile('jason.txt', jason, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.send({ message: 'received' });
});
app.listen(PORT);
