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
  req.body.dictionaryTitle = req.body['dictionary-title'];
  req.body.kanjiInput = req.body['kanji-input'];
  req.body.yomikataInput = req.body['yomikata-input'];
  req.body.definitionInput = req.body['definition-input'];
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    if (doc) {
      const newDict = {
        title: req.body.dictionaryTitle,
        words: []
      };
      if (Array.isArray(req.body.kanjiInput)) {
        for (let i = 0; i < req.body.kanjiInput.length; i++) {
          newDict.words.push({
            kanji: req.body.kanjiInput[i],
            yomikata: req.body.yomikataInput[i],
            definition: req.body.definitionInput[i]
          });
        }
      } else {
        newDict.words.push({
          kanji: req.body.kanjiInput,
          yomikata: req.body.yomikataInput,
          definition: req.body.definitionInput
        });
      }
      console.log(newDict);
      db.update({ _id: req.user._id }, { $push: { myDictionaries: newDict } }, {}, function () {});
    }
  });
  res.redirect('/');
});
