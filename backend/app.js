const express = require('express');
const session = require('express-session');
const razorpay=require("razorpay");
const checkAuth = require('./middleware/checkAuth');
const http = require('http');
const socketIo = require('socket.io');

const config=require('dotenv').config({ path: "./config/config.env"});
if (config.error) {
  console.error("Error loading .env file:", config.error);
  process.exit(1); // Exit the application if there is an error loading the .env file
}
const bodyParser=require('body-parser');
const app = express();
const notifyCron= require('./CronJobs');

const server = http.createServer(app); // Create HTTP server
const io = socketIo(server,{
                             cors: {
                               origin: 'http://localhost:3000', // Frontend URL
                               methods: ['GET', 'POST'],
                               allowedHeaders: ['Authorization'],
                               credentials: true,
                             },
                           }); // Integrate socket.io with HTTP server
const userSockets = {}; // Create an object to store user sockets

io.on('connection', (socket) => {
  console.log('A user connected');

// Emit a notification to the connected client
//  socket.emit('notification', { message: 'Special discount' });

  // Handle WebSocket events

  socket.on('register', (userId) => {
      // Store userId in socket for later use
      socket.userId = userId;
      userSockets[userId] = socket; // Associate the userId with the socket
      console.log(`User registered with id: ${userId}`);
    });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    delete userSockets[socket.userId];
  });

  // You can listen to other events here
});

module.exports = function emitNotificationToUser(userId, message) {
console.log("in func emitNotificationToUser",userId,message);
    const userSocket = userSockets[userId];

    if (userSocket) {
        userSocket.emit('notification',{ message:message});
    } else {
        console.log(`User with ID ${userId} is not connected.`);
    }
}
//const emitNotificationToUser=new String ("crazy");
//module.exports=emitNotificationToUser;
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require("mongoose");
try{
mongoose.connect(process.env.MONGODB_URI,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,});
  console.log('Connected to MongoDB Atlas');
}
catch(err){
    console.log("error connecting to mongoDB Atlas",err.message);
}

/*setInterval(() => {
  console.log('Current connected users:', Object.keys(userSockets));
}, 10000); // Log every 10 seconds for debugging*/

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
const vendorRoutes=require('./routes/vendor');
const TicketRoutes=require('./routes/tickets');
const NotificationRoutes=require('./routes/notifications');
const SubscriptionRoutes=require('./routes/subscription');

const path = require('path');
app.use('/Images', express.static(path.join(__dirname, 'Images')));
// Log the resolved path for debugging
console.log('Serving images from:', path.join(__dirname, 'Images'));

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
app.use('/user', userRoutes);
app.use('/2fa',Auth2FARoutes);
//app.use(checkAuth);
app.use('/orders',orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/vendor', vendorRoutes);
app.use('/tickets',checkAuth, TicketRoutes);
app.use('/notifications', NotificationRoutes);
app.use('/subscription', SubscriptionRoutes);


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

