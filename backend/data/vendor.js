const Vendor=require("../models/vendor");
const { paymentRefund } = require('./payment'); // Import the paymentRefund function
const cron = require('node-cron');

const checkAndCloseOrders = async () => {
    try {
        const currentDate = new Date();
        let close_date;
        const orders = await Vendor.find({ status: 'created' });

        for (const order of orders) {
            //let shouldCloseOrder = true;

            //for (const item of order.items) {
                 close_date=new Date(order.item_details.update_date);
                 close_date.setDate(close_date.getDate() + 15);
                 console.log(close_date);

                 if((order.item_details.item_status === 'delivered' && close_date<=currentDate)|| order.item_details.item_status==='refunded'){
                    await Vendor.updateOne(
                        { _id: order._id },
                        {
                            $set: {
                                'item_details.item_status': 'closed',
                                'status': 'closed'
                            }
                        }
                    );

            await order.save();
            console.log(`Order ${order.order_id} has been processed with status closed`);
        }
    }
    }catch (error) {
        console.error('Error checking and closing orders in Vendor:', error);
    }
};
cron.schedule('05 10 * * *', () => {
    console.log('Running scheduled task-Vendor: checkAndCloseOrders everyday at 8am');
    checkAndCloseOrders();
});

const add=async(req,res,next)=>{

    const {vendor_id,item_details,order_id,order_date,status,quantity,client_id,client_details} = req.body;
    console.log("vendor",vendor_id,item_details,order_id,order_date,status,quantity,client_id,client_details);
    const createdItem=new Vendor({vendor_id,item_details,order_id,order_date,status,quantity,client_id,client_details});
    try{
        await createdItem.save();
    }
    catch(error){
        return next(error);
    }
    res.status(201).json({success:true, message:'item created', data:createdItem.id});
};

const remove=async(req,res,next)=>{

    const {id}=req.params;

    const deletedItem=await Vendor.deleteOne({_id:id});
    if(!deletedItem){
        const error= new Error("Could not delete Vendor");
        return next(error);
    }
         res.json({ message: 'Vendor deleted.' });
};

const getAdminOrders = async (req, res, next) => {
    const { id } = req.params;
    console.log(id);


    try {
        const orderItems = await Vendor.aggregate([
            { $match: { vendor_id: id } },
            {
                $group: {
                    _id: "$client_id",
                    clientOrders: { $push: "$$ROOT" },
                    client_id: { $first: "$client_id" }, // Include client_id explicitly
                    client_details: { $first: "$client_details" } // Include client_details explicitly
                }
            }
        ]);
        if (!orderItems || orderItems.length === 0) {
            res.json({ success: false, data: null });
        } else {
            res.json({ success: true, data: orderItems });
        }
    } catch (err) {
        next(err);
    }
};

const changeOrderStatus = async (req, res, next) => {
    try {
        const { orderId, status, update_date, status_update, items } = req.body;
        console.log("vendor changeOrderStatus", orderId, items, status, update_date, status_update, req.userData.userId);

        /*const orders = await Vendor.find({
            order_id: orderId,
            vendor_id: req.userData.userId
        });

        if (orders.length === 0) {
            console.log("Invalid User");
            const error = new Error("You are not authorized user");
            return next(error);
        }*/

        const result = await Vendor.updateMany(
            {
                order_id: orderId,
                vendor_id: req.userData.userId,
                "item_details.id": { $in: items }
            },
            {
                $set: {
                    'item_details.item_status': status,
                    'item_details.update_date': update_date
                },
                $push: {
                    'status_updates': status_update
                }
            },
            { new: true }
        );

         if (result.modifiedCount > 0) {
            console.log(`Vendor ${orderId} updated successfully.`);
            res.json({ success: true, data: result });
         } else {
            console.log("No documents matched the query. No updates made.");
            res.json({ success: false, message: "No matching documents found." ,data:null});
         }
    } catch (err) {
        console.log("Error updating Vendor in changeOrderStatus:", err);
        res.status(500).json({ success: false, message: "Error updating vendor status", data: null });
    }
};

const returnOrder=async(req,res,next)=>{
    const {orderId,items,client_id,status, update_date, status_update}=req.body;
    console.log("Vendor", orderId, items, client_id, status, update_date, status_update);
     try {
            for (const itemId of items) {
              const order = await Vendor.findOneAndUpdate(
                { order_id: orderId, 'item_details.id': itemId, client_id:client_id },
                { $set: { 'item_details.item_status': status, 'item_details.update_date':update_date},
                  $push:{ status_updates: status_update}
                },
                { new: true } // This option ensures the updated document is returned
              );

              if (!order) {
                console.log(`Order ${orderId} or Item ${itemId} not found in Vendor`);
                continue;
              }
            console.log(`Updated Order ${orderId}, Item ${itemId} to status ${status} in Vendor`);
            }

            res.json({ success: true, message: 'statuses updated in Vendor' });

      } catch (error) {
        console.error('Error updating item status in Vendor:', error);
        res.status(500).json({ success: false, message: "Could not update status" });
      }
}


exports.add=add;
exports.remove=remove;
exports.getAdminOrders=getAdminOrders;
exports.changeOrderStatus=changeOrderStatus;
exports.returnOrder=returnOrder;
