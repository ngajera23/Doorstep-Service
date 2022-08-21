var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

const EMPLOYER = 0
const WORKER = 1

var schema = mongoose.Schema({
  local: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  skills: { type: String, required: false },
  role: { type: Number, enum: { EMPLOYER, WORKER }, default: WORKER }
});

schema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

const userModel = mongoose.model('User', schema);

module.exports = userModel;
