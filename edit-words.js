const express = require('express');
const db = require('./db');

const editWords = new express.Router();

let userSets = null;

editWords.get('/', (req, res) => {
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

editWords.get('/:set_name', (req, res) => {
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

module.exports = editWords;
