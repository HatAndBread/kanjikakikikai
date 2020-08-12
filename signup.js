const express = require('express');
const bcrypt = require('bcrypt');
const users = require('./db');

const signup = express.Router();

signup.get('/', (req, res) => {
  res.render('signup', { userInfo: req.user, page: 'signup', message: null });
});

signup.post('/', async (req, res) => {
  let password;
  console.log(req.body);
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
      res.render('signup', {
        userInfo: req.user,
        page: 'signup',
        message: 'Sorry, that user name is already taken.　 😢‍'
      });
    } else {
      users.insert(
        {
          username: req.body.username,
          password: password,
          myDictionaries: [],
          userSettings: {
            brushSize: 70,
            inkColor: '#1d3557',
            questionsPerRound: 10,
            practiceAfterFailure: true,
            loadOnStart: 'basic'
          }
        },
        (err, newDoc) => {
          console.log(newDoc);
          req.login(newDoc, function (err) {
            if (!err) {
              console.log('success');
              res.redirect('/');
            } else {
              res.render('signup', {
                userInfo: req.user,
                page: 'signup',
                message: 'Server error. Please try again later. 😢'
              });
              console.log(err);
            }
          });
        }
      );
    }
  });
});

module.exports = signup;
