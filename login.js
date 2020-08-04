const express = require('express');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const users = require('./db');

const login = express.Router();

passport.use(
  new LocalStrategy(function (username, password, done) {
    users.findOne({ username: username }, function (err, user) {
      if (err) {
        console.log('error!');
        return done(err);
      } else if (!user) {
        console.log('incorrect user!');
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            console.log('incorrect password!');
            return done(null, false, { message: 'Incorrect password.' });
          } else {
            console.log(`welcome, ${username}`);
            return done(null, user);
          }
        });
      }
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  users.findOne({ _id: id }, function (err, user) {
    done(err, user);
  });
});

login.get('/', (req, res) => {
  res.render('login', { userInfo: req.user, page: 'login' });
});

login.post(
  '/',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true })
);

module.exports = login;
