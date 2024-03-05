const express = require('express');
const bodyParser=require('body-parser');
const app = express();

const cors=require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


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
const cartRoutes=require('./routes/cart');

app.use('/items', itemRoutes);
app.use('/fabrics',fabricRoutes);
app.use('/cart',cartRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message: message });
});

//app.listen(5000);
