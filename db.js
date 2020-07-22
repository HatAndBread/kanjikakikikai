const Ned = require('nedb');
module.exports = new Ned({ filename: 'users.db', autoload: true });
