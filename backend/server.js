const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors=require('cors');
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const mongoose = require("mongoose");
try{
mongoose.connect("mongodb://127.0.0.1:27017/MyStore",
{
  useNewUrlParser: true,
  useUnifiedTopology: true,});

}
catch(err){console.log(err.message);}

const Item = require("./models/Item"); // Create the Item model
app.use(cors());
app.get('/items', async (req, res) => {

res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  try {
    const items=await Item.find();
   res.json(items);
    console.log("fetched items");

  } catch (error) {
    console.log("error fetching");
    console.error(error);
    res.status(500).send("Server Error");
  }

});