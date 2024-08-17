const mongoose=require("mongoose");

const orderSchema = new mongoose.Schema({
    customer_details:Object,
    order_date:Date,
    items:[Object],
    totalQuantity:Number,
    totalAmount:Number,
    order_id:String,
    rzr_payment_id:Object,
    status:String,
    status_msg:String,
    client_id:String,
    //status_updates:[{Date,String}]
    });

module.exports=mongoose.model("order",orderSchema,"Orders");