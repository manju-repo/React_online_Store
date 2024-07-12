const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  id:Number,
  name: String,
  category_id: String,
});

module.exports = mongoose.model("Categories", itemSchema,"Categories");