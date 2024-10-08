const Notifications = require("../models/Notifications");
const emitNotificationToUser  = require('../app.js'); // Adjust the path according to your folder structure


const getUSerNotifications=async(req,res,next)=>{
console.log("in user notifications");
     const userId = req.userData.userId; // Assuming userId is available in the request (from auth middleware)
     if(!userId){
        userId= req.params.userId;
     }
     try {
       const notifications = await Notifications.find({
         $or: [
           {
             $and: [
               { isGeneral: true },  // General notifications
               { approved: true }    // Only approved general notifications
             ]
           },
           {
            $and: [
             { isGeneral: false },       // User-specific notifications
             { userId: userId }       // Match the specific user
            ]
           }
         ]
       }).sort({ readByUser:1, createdAt: -1 });   // Sorting by the latest notifications first

       if (!notifications || notifications.length === 0) {
         return res.status(404).json({ message: 'No notifications found' });
       }
       console.log('notifications:', notifications);
       return res.status(200).json({ notifications });
     } catch (err) {
       console.error('Error fetching notifications:', err);
       return res.status(500).json({ message: 'Error fetching notifications' });
     }
   };

const getBanners=async(req,res,next)=>{

     try {
       const banners = await Notifications.find({
         $and: [
               { isGeneral: true },  // General notifications
               { approved: true }    // Only approved general notifications
             ]
       })
       .sort({ createdAt: -1 })  // Sorting by the latest notifications first
       .select({imageUrl:1,_id:0});       // Select only the imageUrl field

       if (!banners || banners.length === 0) {
         console.log("banners", banners);
         return res.status(404).json({ message: 'No banners found' });
       }

       return res.status(200).json({ banners });
     } catch (err) {
       console.error('Error fetching banners:', err);
       return res.status(500).json({ message: 'Error fetching Banners' });
     }
   };


const getNotifications=async(req,res,next)=>{
console.log("in notifications");

    let notifications;
    try{
        if(req.userData.superAdmin)
            notifications=await Notifications.find();
         else
            notifications=await Notifications.find({createdBy:req.userData.userId});
    }catch(err){
        const error= new Error("Could not fetch notifications");
         return next(error);
    }
     if (!notifications) {
        throw new NotFoundError('Could not find any data.');
     }

    res.json({ success:true, notifications: notifications.map(notification => notification.toObject({ getters: true })) });
}

const getNotification=async(req,res,next)=>{
     if(! req.params) {
        const error= new Error("Could not fetch Notification");
        return next(error);
     }
    let notification;
    try{
         notification=await Notifications.findOne({_id:req.params.id});
    }catch(error){
         return next(error);
    }
     if (!notification) {
        throw new NotFoundError('Could not fetch Notification');
     }
    res.json({ success:true, notification: notification.toObject({ getters: true }) });
}

const updateNotification = async (req, res, next) => {
  console.log("from update Notification");
  const notificationId = req.params.id;
  const { isGeneral, notificationMsg } = req.body;

  // Check if a new file is uploaded, otherwise keep the existing image URL
  const newImageUrl = req.file ? `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}` : null;

  try {
    // Find the notification and only update the imageUrl if a new file is uploaded
    const notification = await Notifications.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isGeneral = isGeneral;
    notification.notificationMsg = notificationMsg;

    // Only update imageUrl if a new file is uploaded
    if (newImageUrl) {
      notification.imageUrl = newImageUrl;
    }

    const updatedNotification = await notification.save();
    console.log("Updated Notification:", updatedNotification);
    res.status(201).json({ success: true, message: 'Notification updated', notification: updatedNotification });
  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};
//findByIdAndUpdate

const markAsRead = async (req, res, next) => {
   console.log("from read Notification");
   const userId = req.userData.userId; // Assuming userId is available in the request (from auth middleware)


    const update = { $set: { readByUser: true } }; // Example update operation

    const filter ={ $or: [
               {
                 $and: [
                   { isGeneral: true },  // General notifications
                   { approved: true }    // Only approved general notifications
                 ]
               },
               {
                $and: [
                 { isGeneral: false },       // User-specific notifications
                 { userId: userId }       // Match the specific user
                ]
               }
             ]
            }
  try {
       const result = await Notifications.updateMany(filter, update);
        if (!result) {
          return res.status(404).json({ message: "Unable to mark as read" });
        }
       console.log("Notification marked as read");
       return res.status(200).json({ message: "Notification marked as read" });

  } catch (error) {
    console.log(error.message);
    return next(error);
  }
};


const createNotification=async(req,res,next)=>{
    console.log("in add Notification");
        let imageUrl = req.file ? `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}` : '';

        //const createdBy=String(req.userData.userId);
        const createdBy='65fd8ba87ae74fa750dd06c3';
        const {isGeneral,notificationMsg, userId, productId, userType}=req.body;
        if(!imageUrl){
            console.log('no file');
            imageUrl=req.body.imageUrl;
            console.log('image url ',imageUrl);
        }
        console.log(isGeneral,notificationMsg, userId, productId, userType);
            try{
                const newNotification=new Notifications({
                    isGeneral:isGeneral,
                    userId:userId,
                    productCode:productId,
                    notificationMsg:notificationMsg,
                    imageUrl:imageUrl,
                    createdAt:Date.now(),
                    createdBy:createdBy,
                    userType:userType,
                 });
                await newNotification.save();
                console.log("Notification created", userId);

            // Emit to the specific user only if their socket exists

                emitNotificationToUser( userId, notificationMsg );
                console.log('notification emitted', emitNotificationToUser);

              //io.emit('notification', { userId, message: notificationMsg });
              res.json({success:true, notification:newNotification});
            }
            catch(error){
                console.log("error creating Notification:", error);
                res.json({success:false, notification:null});
            }
    }

const approveNotification = async (req, res, next) => {
    console.log("from approve Notification");
    const id = req.params.id;
    const approvedBy=req.userData.userId;
    const {approved}=req.body;
console.log(id,approved);
  try {
        const updatedNotification= await Notifications.findByIdAndUpdate(id,{
                                 approved:approved,
                                 approvedBy:approvedBy,
                                 approvalDate:Date.now()
                                 },
                                 { new: true } // This option returns the updated document
        );

        if (!updatedNotification) {
          return res.status(404).json({ message: "Notification not found" });
        }
        console.log("Updated Notification:", updatedNotification);
        res.status(201).json({ success: true, message: 'Notification updated', notification: updatedNotification });
  } catch (error) {
        console.log(error.message);
        return next(error);
  }
};

const notifyUser = async (req, res, next) => {
    console.log("from notify user");
    const {productId} = req.params;
    const userId=String(req.userData.userId);
    const {notify}=req.body;
    console.log(productId, userId, notify);
        try{
             let notification=await Notifications.findOne({userId:userId,productCode:productId});
             if(notification){
                console.log("found notification");
                if(notify===false){
                    await Notifications.deleteMany({productCode:productId, userId:userId});
                    console.log("deleted User Notification");
                    res.json({success:true, notification:null});
                }
             }
             else{
             console.log('not found notification');
                if(notify===true){
                    newNotification=new Notifications({
                      isGeneral:false,
                      userId:userId,
                      productCode:productId,
                      notificationMsg:'Stock update',
                      imageUrl:null,
                      createdAt:Date.now(),
                      createdBy:userId,
                    });

                    await newNotification.save();
                    console.log("User Notification created");
                    res.json({success:true, notification:newNotification});
                }
             }
          }
          catch(error){
              console.log("error creating/deleting user Notification:", error);
              res.json({success:false, notification:null});
          }
};

exports.getNotifications=getNotifications;
exports.getBanners=getBanners;
exports.getNotification=getNotification;
exports.createNotification=createNotification;
exports.updateNotification=updateNotification;
exports.getUSerNotifications=getUSerNotifications;
exports.approveNotification=approveNotification;
exports.markAsRead=markAsRead;