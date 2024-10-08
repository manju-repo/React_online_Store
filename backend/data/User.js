const path = require('path');
const config=require('dotenv').config({ path: "./config/config.env"});
if (config.error) {
  console.error("Error loading .env file:", config.error);
  process.exit(1); // Exit the application if there is an error loading the .env file
}
const User = require("../models/User");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const axios = require('axios');
//const multer = require('multer');
/*const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'Images/');
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    });*/

//const upload = multer({ storage });
//getUsers============================================================

const getUsers=async(req,res,next)=>{
    let users;
    try{
        users=await User.find({},'-password');
        if (!users) {
            throw new NotFoundError('Could not find any data.');
         }
        res.json({ users: users.map(user => user.toObject({ getters: true })) });
    }catch(err){
         console.log(error);
         return next(error);
    }
}

const getUser=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch User");
        return next(error);
     }
    let user;
    try{
         user=await User.findOne({_id:req.params.id});
         if (!user) {
             throw new NotFoundError('Could not fetch User');
          }
         res.json({ success:true,user: user.toObject({ getters: true }) });
    }catch(error){
         console.log(error);
         return next(error);
    }

}


const getSubscriptions=async(req,res,next)=>{
    //const id=req.userData.userId;
    const id = req.params.userId || req.userData.userId;
    console.log('in getSubscriptions');
    let pref;
    try{
         pref=await User.findOne({_id:id},'notificationPreferences');

     if (!pref) {
        throw new NotFoundError('Could not fetch pref');
     }
     console.log('subscribed for', pref);
     res.json({ success:true,data: pref });
     }catch(error){
          console.log(error)
         return next(error);
    }
}

//=================================================================
const createRazorpayAccount = async (req,res,next) => {
const userData=req.body;
console.log(userData);
  try {
    let contactData= {};
    let bankData={};

    contactData.name=userData.firstname+" "+ userData.lastname;
    contactData.email=userData.email;
    contactData.contact=userData.phone;
    contactData.type="vendor";
    contactData.reference_id="J'adore "+ userData.phone;
        bankData.bank_account={name:userData.firstname+" "+ userData.lastname ,ifsc:userData.ifsc_code ,account_number:userData.account_number};
console.log("bank data:", bankData);

    const response = await axios.post('https://api.razorpay.com/v1/contacts', contactData, {
      auth: {
        username: process.env.RAZORPAY_API_KEY,
        password: process.env.RAZORPAY_API_SECRET,
      },
    });
    const contact_id= response.data.id;
    //console.log("contact id ",contact_id);
console.log("cd: ", contactData);

 console.log("ud: ", userData);
    bankData.contact_id=contact_id;
    bankData.account_type="bank_account";
console.log("bank data:", bankData);
     const acc_response = await axios.post('https://api.razorpay.com/v1/fund_accounts', bankData, {
     auth: {
        username: process.env.RAZORPAY_API_KEY,
        password: process.env.RAZORPAY_API_SECRET,
      },
    });
      console.log("fund acc ", acc_response.data.id);
      res.json({success:true,data:acc_response.data});
    }
   catch (error) {
    console.error('Error creating Razorpay account:');
    return next(error);
  }
};

//signup=================================================================

const signUp=async(req,res,next)=>{
console.log("in signup");

    const {name, email, password, phone, user_type}=req.body;
    const {bus_type, bus_name, bus_category, bus_subcategory, pan, gstin, address}=req.body;
    const {account_number,account_holder_name,ifsc_code,wishlist,cart_id,orders}=req.body;
console.log('email ',email,password);
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error= new Error("Sign Up failed");
        console.log(err);
        return next(error);
    }
    if(existingUser){
        const error= new Error("User already exists");
        return next(error);
    }



//console.log("before hashing ");
    let hashedPassword;
    try{
        hashedPassword=await bcrypt.hash(password,12);
    }
    catch(err){
console.log(err);
        const error= new Error("could not create User");
        return next(error);
    }
console.log("file ",req.file, req.file?.path);
  //const imageUrl = req.file ? `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}` : null;

    const imageUrl = req.file ? `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}` : req.body.profileImage;;

    const createdUser=new User({
        name, email, password:hashedPassword, phone, user_type,super_admin:false,
        bus_type, bus_name, bus_category, bus_subcategory, pan, gstin, address,
        account_number, account_holder_name, ifsc_code, wishlist, cart_id, orders,
        profileImage: imageUrl // Save the file path in the user document
    });

    try{
        await createdUser.save();
    }catch(err){
        const error=new Error("Sign up failed, please try again later.");
        console.log(err);
        return next(error);
    }


    let token;
    try{
        token=jwt.sign(
        {userId:createdUser.id, email:createdUser.email, userType:createdUser.user_type, superAdmin:createdUser.super_admin},
        'supersecret_dont_share',
        {expiresIn: '1h'}
        );
    }catch(err){
        const error=new Error("Sign up failed, please try again later");
        console.log(err);
        return next(error);
    }
    /*if(cart_id){
            existingUser.cart_id=cart_id;
    }*/

    res.json({
         userId: createdUser.id,
         email: createdUser.email,
         user_type: createdUser.user_type,
         token:token
         });

}

//login=================================================================

const login= async(req, res, next)=>{
    const {email, password, cart_id}=req.body;
console.log("login",email,password,cart_id);
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error=new Error("Login failed! Please try again later.");
        return next(error);
    }
    if(!existingUser){
        const error=new Error("User does not exist");
        return next(error);
    }

    let isValidPassword;
    try{
        isValidPassword=await bcrypt.compare(password, existingUser.password);
    }catch(err){
        const error=new Error("Invalid credentials, please try again");
        return next(error);
    }
    if(! isValidPassword){
        const error=new Error("Invalid credentials, could not log you in.");
        return next(error);
    }
    let token;
    try{
        token=jwt.sign(
        {userId: existingUser.id, email: existingUser.email, userType: existingUser.user_type, superAdmin:existingUser.super_admin},
        'supersecret_dont_share',
        {expiresIn: '1h'}
        );
    }catch(err){
console.log(err);
        const error=new Error("Logging in failed, please try again later");
        return next(error);
    }

    if(!existingUser.cart_id && cart_id){
        existingUser.cart_id=cart_id;
    }

    try{
        await existingUser.save();
    }catch(err){
        const error=new Error("Login failed, please try again later.");
        return next(error);
    }

    res.json({
         userId: existingUser.id,
         user_type:existingUser.user_type,
         super_admin:existingUser.super_admin,
         email: existingUser.email,
         token:token
         });
    }


async function update(req,res,next){
console.log("from put user",req.body);
const {name,phone,address}=req.body;
const {bus_name,bus_type,bus_category,bus_subcategory,pan,gstin,account_number,account_holder_name,ifsc_code}=req.body;
const id=req.params.id;

    console.log("file ",req.file, req.file?.path);
    const imageUrl = req.file ? `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}` : req.body.profileImage;;


  console.log("From User PUT ",id, name, phone, imageUrl, address,bus_name,bus_type,bus_category,bus_subcategory,pan,gstin,account_number,account_holder_name,ifsc_code);

   try{
        const updatedItem=await User.findByIdAndUpdate(id,{name:name, phone:phone, address:address, profileImage:imageUrl,
        bus_name,bus_type,bus_category,bus_subcategory,pan,gstin,account_number,account_holder_name,ifsc_code },
        { new: true });
        res.status(201).json({success:true, message:'item updated', user:updatedItem});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}

//setCartId==========================================================================

    const setCartId=async(req,res,next)=>{
        const {id, cart_id}=req.body;
        //const id=req.userData.userId;
         try{
                user=await User.findByIdAndUpdate(id,{cart_id:cart_id});
            }catch(err){
                console.log("error", err);
                const error=new Error("User not found");
                return next(error);
            }
            if(!user){
                console.log("user not found");
                const error=new Error("User not found");
                return next(error);
            }

        console.log("user found");
        res.json({data:"ok"});
    }

    const setWishlist=async(req,res,next)=>{
    console.log("in wl");
        const {id,wishlist}=req.body;
        //const id=req.userData.userId;
        //console.log(id,wishlist);

            try{
                user=await User.findByIdAndUpdate(id,
                                                 {wishlist:wishlist});
            }catch(err){
                console.log("error", err);
                const error=new Error("User not found");
                return next(error);
            }
            if(!user){
                console.log("user not found");
                const error=new Error("User not found");
                return next(error);
            }

        console.log("user found");
        res.json({data:user,success:true});
    }

    const setSubscriptions=async(req,res,next)=>{
    console.log("in set subscriptions");
        const {subscriptions}=req.body;
        const id=req.userData.userId;

        console.log(id,subscriptions);

  let user;
            try{
                user=await User.findByIdAndUpdate(id,
                         {notificationPreferences:subscriptions});
            }catch(err){
                console.log("error", err);
                const error=new Error("User not found");
                return next(error);
            }
            if(!user){
                console.log("user not found");
                const error=new Error("User not found");
                return next(error);
            }

        console.log("user found");
        res.json({data:user,success:true});
    }

const addOrder=async(req,res,next)=>{
    console.log("in add order");
        const {id,orderId}=req.body;
        //console.log(id,orderId);

            try{
                const user = await User.findByIdAndUpdate(
                        id,
                        { $addToSet: { orders: orderId } },
                        { new: true } // This option returns the updated document
                    );
            }catch(err){
                console.log("error", err);
                const error=new Error("User not found");
                return next(error);
            }
            if(!user){
                console.log("user not found");
                const error=new Error("User not found");
                return next(error);
            }

        console.log("user found");
        res.json({data:user,success:true});
    }

    exports.getUsers=getUsers;
    exports.getUser=getUser;
    exports.update=update;
    exports.signUp=signUp;
    exports.login=login;
    exports.setCartId=setCartId;
    exports.setWishlist=setWishlist;
    exports.addOrder=addOrder;
    exports.getSubscriptions=getSubscriptions;
    exports.setSubscriptions=setSubscriptions;
    exports.createRazorpayAccount=createRazorpayAccount;