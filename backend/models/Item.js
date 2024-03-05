const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id:Number,
  rate:Number,
  type: String,
  quantity:Number,
  totalPrice:Number
});

module.exports = mongoose.model("Item", itemSchema,"Item");