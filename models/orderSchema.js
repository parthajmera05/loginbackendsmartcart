const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  amazonPrice: String,
  flipkartPrice: String,
  jiomartPrice: String,
  amazonUrl: String,
  flipkartUrl: String,
  jiomartUrl: String,
});

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  items: [itemSchema],
  total_price: Number,
  platform: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
