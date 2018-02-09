var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockdataSchema = new Schema({
  stockname: String,
  startdate: Date,
  dataset: Array
});

module.exports = mongoose.model('Stockdata', stockdataSchema);