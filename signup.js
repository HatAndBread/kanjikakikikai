const express = require('express');
const bcrypt = require('bcrypt');
const users = require('./db');

const signup = express.Router();

signup.get('/', (req, res) => {
  res.render('signup', { userInfo: req.user, page: 'signup' });
});

signup.post('/', async (req, res) => {
  let password;
  try {
    password = await bcrypt.hash(req.body.password, 11);
  } catch (err) {
    res.send('Server error. Please try again later.');
  }
  users.find({ username: req.body.username }, (err, docs) => {
    if (err) {
      console.log(err);
    }
    if (docs.length > 0) {
      res.send('Sorry, that user name is already taken.');
    } else {
      users.insert({ username: req.body.username, password: password, myDictionaries: [] }, (err, newDoc) => {
        console.log(newDoc);
      });
      res.send(`Thank you for signing up, ${req.body.username}`);
    }
  });
});

module.exports = signup;
