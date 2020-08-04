const express = require('express');
const db = require('./db');
const checkAuthenticated = require('./checkAuthenticated');

const editWords = new express.Router();

let userSets = null;

editWords.get('/', checkAuthenticated, (req, res) => {
  console.log(req.body);
  db.findOne({ _id: req.user._id }, (err, doc) => {
    if (!doc.myDictionaries || doc.myDictionaries.length === 0) {
      res.send("You haven't uploaded any study sets yet.");
    } else {
      console.log(doc);
      console.log(doc.myDictionaries);
      userSets = doc.myDictionaries;
      res.render('edit-sets', { sets: doc.myDictionaries });
    }
  });
});

editWords.get('/:set_name', checkAuthenticated, (req, res) => {
  console.log(req.params.set_name);
  console.log('userSets: ');
  console.log(userSets);
  let requestedSet = null;
  for (let i = 0; i < userSets.length; i++) {
    if (userSets[i].title === req.params.set_name) {
      requestedSet = userSets[i];
      res.send({ requestedSet: requestedSet });
      break;
    }
  }
});

editWords.put('/', checkAuthenticated, (req, res) => {
  console.log('hey everybody! yo');
  console.log(req.body);

  let myDictionaries;
  let title = req.body.title;
  let newDictionary = req.body.wordList;

  db.findOne({ _id: req.user._id }, (err, doc) => {
    console.log(doc);
    myDictionaries = doc.myDictionaries;
    for (let i = 0; i < myDictionaries.length; i++) {
      if (myDictionaries[i].title === title) {
        myDictionaries[i].words = newDictionary;
      }
    }

    console.log(myDictionaries);

    db.update({ _id: req.user._id }, { $set: { myDictionaries: myDictionaries } }, {}, (err, numReplaced) => {
      console.log('yo i found it thjis is the stuff ');
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send({ message: 'success' });
      }
      console.log(numReplaced);
    });
  });
});

module.exports = editWords;
