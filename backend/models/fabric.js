const mongoose = require("mongoose");

const fabricSchema = new mongoose.Schema({
    id:Number,
    Fabid:Number,
    price:Number,
    category: String,
    sub_category: String,
    type: String,
    image:String,
    colour:String,
    desc:String,
    details:String
});

module.exports = mongoose.model("fabric", fabricSchema,"Fabric_Store");