const express = require('express');

const settings = new express.Router();

module.exports = settings;

settings.get('/', (req, res) => {
  res.render('settings', {
    userInfo: req.user,
    page: 'settings'
  });
});
