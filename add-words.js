const express = require('express');
const checkAuthenticated = require('./checkAuthenticated');
const db = require('./db');

const addWords = new express.Router();

module.exports = addWords;

addWords.get('/', checkAuthenticated, (req, res) => {
  res.render('create-new-set');
});

addWords.post('/', (req, res) => {
  console.log(req.user);
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (doc) {
      let title = req.body['dictionary-title'];
      let newDict = {};
      newDict[title] = [];
      console.log(title);
      for (let i = 0; i < req.body['kanji-input'].length; i++) {
        newDict[title].push({ kanji: req.body['kanji-input'][i], yomikata: req.body['yomikata-input'][i] });
      }
      console.log(newDict);
      db.update({ _id: req.user._id }, { $push: { myDictionaries: newDict } }, {}, function () {});
    }
  });
  res.send('dekita');
});

addWords.get('/get_set', (req, res) => {
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (doc) {
      console.log(doc);
      res.send({ sets: doc.myDictionaries });
    }
  });
});
