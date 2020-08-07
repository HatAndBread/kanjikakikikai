const express = require('express');
const checkAuthenticated = require('./checkAuthenticated');

const settings = new express.Router();

module.exports = settings;

settings.get('/', checkAuthenticated, (req, res) => {
  res.render('settings', {
    userInfo: req.user,
    page: 'settings'
  });
});
