var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  employer: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});


const jobModel = mongoose.model('Job', schema);

module.exports = jobModel;
