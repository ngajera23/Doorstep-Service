var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = mongoose.Schema({
  worker: { type: Schema.Types.ObjectId, ref: 'User' },
  job: { type: Schema.Types.ObjectId, ref: 'Job' },
});


const JobWorker = mongoose.model('JobWorker', schema);

module.exports = JobWorker;
