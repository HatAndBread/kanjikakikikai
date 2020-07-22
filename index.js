const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
require('dotenv').config();
const app = express();

let PORT = 3000 || process.env.PORT;
const login = require('./login');
const signup = require('./signup');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(session({ secret: process.env.SECRET, saveUninitialized: false, resave: false, failureFlash: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/login', login);
app.use('/signup', signup);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT);
