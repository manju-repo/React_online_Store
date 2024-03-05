const mongoose=require("mongoose");

const cartSchema=new mongoose.Schema({
    items:[Object],
    totalQuantity:Number
    });

module.exports=mongoose.model("cart",cartSchema,"Cart");