const express = require('express');

const about = new express.Router();

module.exports = about;

about.get('/', (req, res) => {
  res.render('about', { userInfo: req.user, page: 'about' });
});
