const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
    product_code: String,
    price:Number,
    category: String,
    sub_category: String,
    type: String,
    image:[String],
    colour:String,
    size:Object,
    desc:String,
    details:[String],
    created_by:Object,
    stock:Number
});

module.exports = mongoose.model("store", StoreSchema,"Store");