const mongoose = require("mongoose");
const uniqueValidator=require('mongoose-unique-validator');


const VendorSchema = new mongoose.Schema({
    vendor_id:String,
    item_details:Object,
    order_id:String,
    status:String,
    quantity:Number,
    client_id:String,
    client_details:Object,
    status_updates:[]
},{collection: 'Vendor'});

module.exports = mongoose.model("Vendor", VendorSchema);