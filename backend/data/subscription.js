const Subscription = require("../models/Subscriptions");

const notifyUser = async (req, res, next) => {
    console.log("from notify user");
    const {productId} = req.params;
    const userId=String(req.userData.userId);
    const {notify, notificationType}=req.body;
    console.log(productId, userId, notificationType, notify);
        try{
             let subscription=await Subscription.findOne({userId:userId,productCode:productId});
             if(subscription){
                console.log("found Subscription");
                if(notify===false){
                    await Subscription.deleteMany({productCode:productId, userId:userId});
                    console.log("deleted User Subscription");
                    res.json({success:true, subscription:null});
                }
             }
             else{
             console.log('not found Subscription');
                if(notify===true){
                    newSubscription=new Subscription({
                      userId:userId,
                      productCode:productId,
                      notificationType:notificationType,
                      createdAt:Date.now(),
                      createdBy:userId,
                    });

                    await newSubscription.save();
                    console.log("User Subscription created");
                    res.json({success:true, subscription:newSubscription});
                }
             }
          }
          catch(error){
              console.log("error creating/deleting user Notification:", error);
              res.json({success:false, notification:null});
          }
};

const checkSubscription = async(req,res,next)=>{
    console.log("from get subscribed users");
    const {productId} = req.params;
    try{
         let subscription=await Subscription.find({productCode:productId,subscriptionStatus:'Active'});
         if(subscription){
            console.log("found Subscription", subscription);
            res.json({success:true, subscription:subscription});
         }
     }
     catch(error){
          console.log("error fetching user subscriptions:", error);
          res.json({success:false, subscription:null});
      }

}
exports.notifyUser=notifyUser;
exports.checkSubscription=checkSubscription;