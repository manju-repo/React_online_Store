const mongoose = require("mongoose");
const uniqueValidator=require('mongoose-unique-validator');


const userSchema = new mongoose.Schema({
    name:{type:String},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, minlength:6},
    phone: {type: String,minlength: 10,maxlength: 10,match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']},
    profileImage: {type:String},
    user_type: {type:String},
    super_admin: {type:Boolean},
    bus_type:  {type:String},
    bus_name:  {type:String},
    bus_category:  {type:String},
    bus_subcategory:  {type:String},
    pan:    {type:String},
    gstin:  {type:String},
    address:    [String],
    account_number: {type:String},
    account_holder_name:    {type:String},
    ifsc_code:  {type:String},
    cart_id:{type:String},
    wishlist:[String],
    orders:[String],
    notificationPreferences:{type:Object, default:null}
},{collection: 'User'});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);