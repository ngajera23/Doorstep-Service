var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = mongoose.Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'User' },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

const Reviews = mongoose.model('Reviews', schema);

module.exports = Reviews;
