var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Person = new Schema({
  _id: String,
  firstname: String,
  lastname: String
});

module.exports = mongoose.model('Person', Person);