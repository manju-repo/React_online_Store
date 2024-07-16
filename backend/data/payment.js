const instance = require('../app.js');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const createRazorpayAccount = async (userData) => {
  try {
    const response = await axios.post('https://api.razorpay.com/v1/accounts', userData, {
      auth: {
        username: process.env.RAZORPAY_API_KEY,
        password: process.env.RAZORPAY_API_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Razorpay account:', error.response ? error.response.data : error.message);
    throw error;
  }
};

 const checkout= async(req,res) => {

    const options={
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    try{
    const created_order = await instance.orders.create(options);
    //console.log("in Checkout ",created_order);
    res.status(200).json({success: true,created_order});
    }
    catch(error){
        //console.log(error);
    }
};

 const paymentVerification = async (req, res) => {
 try{
 //console.log("req body", req.body);
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
//console.log(expectedSignature);


  if ( expectedSignature === razorpay_signature){
    console.log("matched");
    return res.status(200).json({success:true,message:"Payment Successful",data:razorpay_payment_id});
   }
  else
    //console.log("unmatched");
   return res.status(400).json({success:false,message:"Payment failed! Invalid signature",data:null});

    // Database comes here

 }catch(error){
 //console.log(error);
}
};

 const paymentTransfer = async (req, res) => {
 console.log("in pt");
   try{
    const razorpay = new Razorpay({
        key_id:  process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
    });

        let {paymentId,amount,accountId} = req.body;
        amount*=100;
      // RazorpayClient razorpay = new RazorpayClient("[YOUR_KEY_ID]", "[YOUR_KEY_SECRET]");

//console.log(paymentId,amount,accountId);

   const transferresp=await razorpay.payments.transfer(paymentId,{
     "transfers": [
      {
        "account": accountId,
        "amount": amount,
        "currency": "INR",
        "notes": {
          "name": "J\'adore",
          "roll_no": "IEC2011025"
        },
        "linked_account_notes": ["roll_no"],
        "on_hold": false
      }
    ]
   });
          //console.log("Funds transferred successfully",transferresp);
          res.json({success:true,data:transferresp});
    }
    catch(err){
        //console.log("Error transferring funds ",err);
        res.json({success:false,data:null})
    }
};

const paymentRefund = async (req, res) => {
 console.log("in pr");
   try{
    const razorpay = new Razorpay({
        key_id:  process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
         });

        let {paymentId,amount} = req.body;
        amount*=100;
      // RazorpayClient razorpay = new RazorpayClient("[YOUR_KEY_ID]", "[YOUR_KEY_SECRET]");

       console.log("to be refunded",paymentId,amount);

       const refundResp=await razorpay.payments.refund(paymentId,{
            amount : amount,
            reverse_all : 1
        });


      console.log("Funds refunded successfully",refundResp);
      res.json({success:true,data:refundResp});
    }
    catch(err){
        console.log("Error refunding funds ",err.message);
        res.json({success:false,data:null, message:"Error refunding funds "+err.message});
    }
};

exports.createRazorpayAccount=createRazorpayAccount;
exports.checkout=checkout;
exports.paymentVerification=paymentVerification;
exports.paymentTransfer=paymentTransfer;
exports.paymentRefund=paymentRefund;