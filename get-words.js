const express = require('express');
const db = require('./db');
const checkAuthenticated = require('./checkAuthenticated');

const getWords = new express.Router();

getWords.get('/:title', checkAuthenticated, (req, res) => {
  console.log(req.params.title);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (err) {
      console.log(err);
      res.send('Server error. Try again later.');
    } else {
      let dict;
      for (let i = 0; i < doc.myDictionaries.length; i++) {
        if (doc.myDictionaries[i].title === req.params.title) {
          dict = doc.myDictionaries[i];
        }
      }
      res.send({ set: dict });
    }
  });
});

module.exports = getWords;
