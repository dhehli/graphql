var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Course = new Schema({
  _id: String,
  title: String,
  author: String,
  description: String,
  topic: String,
  url: String
});

module.exports = mongoose.model('Course', Course);