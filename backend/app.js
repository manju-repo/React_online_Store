const express = require('express');
const session = require('express-session');
const razorpay=require("razorpay");
const checkAuth = require('./middleware/checkAuth');


const config=require('dotenv').config({ path: "./config/config.env"});
if (config.error) {
  console.error("Error loading .env file:", config.error);
  process.exit(1); // Exit the application if there is an error loading the .env file
}
const bodyParser=require('body-parser');
const app = express();
const instance=new razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
module.exports = instance;
const cors=require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type','Accept','Authorization');
  next();
});

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require("mongoose");
try{
mongoose.connect("mongodb://127.0.0.1:27017/MyStore",
{
  useNewUrlParser: true,
  useUnifiedTopology: true,});

}
catch(err){console.log(err.message);}

const itemRoutes = require('./routes/items');
const fabricRoutes = require('./routes/fabrics');
const sareeRoutes = require('./routes/sarees');
const Auth2FARoutes = require('./routes/Auth2FA')
const bestsellerRoutes = require('./routes/bestsellers');
const cartRoutes=require('./routes/cart');
const userRoutes=require('./routes/User');
const paymentRoutes=require('./routes/payment');
const orderRoutes=require('./routes/orders');
const storeRoutes=require('./routes/store');
const vendorRoutes=require('./routes/vendor')
app.use('/store', storeRoutes);
app.use('/categories', itemRoutes);

app.use('/fabrics',fabricRoutes);
app.use('/sarees',sareeRoutes);
//app.use('/lehengas',lehengaRoutes);
//app.use('/kurtas',kurtaRoutes);
//app.use('/salwars',salwarRoutes);
//app.use('/accessories',accRoutes);
app.use('/bestsellers',bestsellerRoutes);
app.use('/cart',cartRoutes);
app.use('/user',userRoutes);
app.use('/2fa',Auth2FARoutes);
app.use(checkAuth);
app.use('/orders',orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/vendor', vendorRoutes);

app.use((error, req, res, next) => {
console.log(error.message);
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

app.get('/getkey', (req,res)=>{
console.log("key ",process.env.RAZORPAY_API_KEY);
    res.status(200).json({key:process.env.RAZORPAY_API_KEY})}
);