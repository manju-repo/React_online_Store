const mongoose = require("mongoose");
const uniqueValidator=require('mongoose-unique-validator');


const userSchema = new mongoose.Schema({
    firstname:{type:String, required:true},
    lastname: {type:String},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true, minlength:6},
    user_type: {type:String},
    cart_id:{type:String},
    wishlist:[String],
    orders:[String]
},{collection: 'User'});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);