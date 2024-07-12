const mongoose = require("mongoose");

const bestsellerSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  image: String,
  details: String
});

module.exports = mongoose.model("Bestseller", bestsellerSchema,"Bestsellers");