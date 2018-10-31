//Todo: Handle Conneciton Error
var mongoose = require('mongoose');

var Course = new mongoose.Schema({
  _id: String,
  title: String,
  author: String,
  description: String,
  topic: String,
  url: String
});

module.exports = mongoose.model('Course', Course);