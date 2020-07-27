const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
require('dotenv').config();
const methodOverride = require('method-override'); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn’t support it.
const app = express();
const checkAuthenticated = require('./checkAuthenticated');

let PORT = 3000 || process.env.PORT;
const login = require('./login');
const signup = require('./signup');
const addWords = require('./add-words');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({ secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false, failureFlash: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use('/login', login);
app.use('/signup', signup);
app.use('/add_words', addWords);

app.get('/', checkAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.session.passport);
  res.render('index', { userInfo: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(PORT);
