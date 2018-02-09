var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
  stockname: String,
  created_at: Date,
});

module.exports = mongoose.model('Stock', stockSchema);