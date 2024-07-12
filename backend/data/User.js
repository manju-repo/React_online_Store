const User = require("../models/User");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

//getUsers============================================================

const getUsers=async(req,res,next)=>{
    let users;
    try{
    console.log("data");
         users=await User.find({},'-password');
    }catch(err){
        const error= new Error("Could not fetch users");
         return next(error);
    }
     if (!users) {
        throw new NotFoundError('Could not find any data.');
     }
    console.log(users);
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

const getUser=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch User");
        return next(error);
     }
    let user;
    try{
         user=await User.findOne({_id:req.params.id});
    }catch(error){
         return next(error);
    }
     if (!user) {
        throw new NotFoundError('Could not fetch User');
     }
    console.log(user);
    res.json({ success:true,user: user.toObject({ getters: true }) });
}

//signup=================================================================

const signUp=async(req,res,next)=>{
    const {firstname,lastname,email,password,cart_id,user_type}=req.body;
//console.log(firstname,lastname,email,password,cart_id);
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
        const error= new Error("Sign Up failed");
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

    const createdUser=new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        cart_id,
        user_type,
    });

    try{
        await createdUser.save();
    }catch(err){
        const error=new Error("Sign up failed, please try again later.");
        return next(error);
    }


    let token;
    try{
        token=jwt.sign(
        {userId: createdUser.id,email: createdUser.email},
        'supersecret_dont_share',
        {expiresIn: '1h'}
        );
    }catch(err){
        const error=new Error("Sign up failed, please try again later");
        return next(error);
    }
    if(cart_id){
            existingUser.cart_id=cart_id;
    }

    res.json({
         userId: createdUser.id,
         email: createdUser.email,
         token:token
         });
 }


//login=================================================================

const login= async(req, res, next)=>{
    const {email, password, cart_id}=req.body;
//console.log("login",email,password,cart_id);
    let existingUser;
    try{
        existingUser=await User.findOne({email:email});
    }catch(err){
console.log(err);
        const error=new Error("Login failed! Please try again later.");
        return next(error);
    }
    if(!existingUser){
    console.log("user not found");
        const error=new Error("User does not exist");
        return next(error);
    }
console.log("user found");
    let isValidPassword;
    try{
        isValidPassword=await bcrypt.compare(password, existingUser.password);
    }catch(err){
console.log(err);
        const error=new Error("Invalid credentials, please try again");
        return next(error);
    }
    if(! isValidPassword){
console.log("password invalid");
        const error=new Error("Invalid credentials, could not log you in.");
        return next(error);
    }
console.log("password hashed")
    let token;
    try{
        token=jwt.sign(
        {userId: existingUser.id,email: existingUser.email,userType: existingUser.user_type},
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
console.log("before save");
    try{
        await existingUser.save();
    }catch(err){
console.log(err);
        const error=new Error("Login failed, please try again later.");
        return next(error);
    }
console.log("return from user data");
    res.json({
         userId: existingUser.id,
         user_type:existingUser.user_type,
         email: existingUser.email,
         token:token
         });
    }

//setCartId==========================================================================

    const setCartId=async(req,res,next)=>{
        const {id, cart_id}=req.body;
        //console.log(id,cart_id);
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
    exports.signUp=signUp;
    exports.login=login;
    exports.setCartId=setCartId;
    exports.setWishlist=setWishlist;
    exports.addOrder=addOrder;