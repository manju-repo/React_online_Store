const mongoose=require("mongoose");

const orderSchema = new mongoose.Schema({
    customer_details:Object,
    items:[Object],
    totalQuantity:Number,
    totalAmount:Number,
    order_id:String,
    rzr_payment_id:Object,
    status:String,
    client_id:String
    });

module.exports=mongoose.model("order",orderSchema,"Orders");