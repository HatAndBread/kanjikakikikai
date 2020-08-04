const express = require('express');
const checkAuthenticated = require('./checkAuthenticated');
const db = require('./db');

const addWords = new express.Router();

module.exports = addWords;

let sets = null;

addWords.get('/', checkAuthenticated, (req, res) => {
  res.render('create-new-set', { userInfo: req.user, sets: sets, page: 'add-words' });
});

addWords.post('/', (req, res) => {
  console.log(req.user);
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (doc) {
      const newDict = {
        title: req.body['dictionary-title'],
        words: []
      };
      for (let i = 0; i < req.body['kanji-input'].length; i++) {
        newDict.words.push({
          kanji: req.body['kanji-input'][i],
          yomikata: req.body['yomikata-input'][i],
          definition: req.body['definition-input'][i]
        });
      }
      console.log(newDict);
      db.update({ _id: req.user._id }, { $push: { myDictionaries: newDict } }, {}, function () {});
    }
  });
  res.redirect('/');
});
