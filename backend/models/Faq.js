const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  status:String,
});

module.exports = mongoose.model("Faq", FaqSchema,"FAQ");