const express = require('express');

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('index', { userInfo: null });
};
