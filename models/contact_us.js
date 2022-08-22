var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});


const ContactUs = mongoose.model('ContactUs', schema);

module.exports = ContactUs;
