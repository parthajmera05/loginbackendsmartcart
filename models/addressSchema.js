// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  email: { type: String, required: true }, // to associate with user
  name: String,
  addressLine: String,
  city: String,
  zipCode: String,
  phone: String,
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
