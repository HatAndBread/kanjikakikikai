const express = require('express');
const checkAuthenticated = require('./checkAuthenticated');
const db = require('./db');

const settings = new express.Router();

module.exports = settings;

settings.get('/', checkAuthenticated, (req, res) => {
  res.render('settings', {
    userInfo: req.user,
    page: 'settings'
  });
});

settings.post('/', checkAuthenticated, (req, res) => {
  console.log(req.user);
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      db.update({ _id: req.user._id }, { $set: { userSettings: req.body } }, {}, function (err, numReplaced) {
        if (err) {
          console.log(err);
        } else {
          console.log('Number replaced: ');
          console.log(numReplaced);
        }
      });
    }
  });
  res.send({ message: 'success' });
});
