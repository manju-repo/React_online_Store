const Order=require("../models/order");
const cron = require('node-cron');

const checkAndCloseOrders = async () => {
    try {
        const currentDate = new Date();
        let close_date;
        const orders = await Order.find({ status: 'created' });

        for (const order of orders) {
            let shouldCloseOrder = true;

            for (const item of order.items) {
                 close_date=new Date(item.update_date);
                 close_date.setDate(close_date.getDate() + 15);
                 console.log(close_date);

                 if((item.item_status === 'delivered' && close_date<=currentDate)|| item.item_status==='refunded'){
                    item.item_status = 'closed';
                 }
                 else {
                    shouldCloseOrder = false;
                }
            }

            if (shouldCloseOrder) {
                order.status = 'closed';
            }

            await order.save();
            console.log(`Order ${order._id} has been processed with status ${order.status}`);
        }
    } catch (error) {
        console.error('Error checking and closing orders:', error);
    }
};

// Schedule the checkAndCloseOrders function to run every hour
cron.schedule('30 8 * * *', () => {
    console.log('Running scheduled task: checkAndCloseOrders everyday at 8am');
    checkAndCloseOrders();
});

const createOrder=async(req,res,next)=>{
    const {items,totalQuantity,totalAmount,client_id}=req.body;
    //console.log("adding order",items,totalQuantity,totalAmount,client_id);
    try{
        const createdOrder=new Order({items, totalQuantity, totalAmount, client_id});
        //console.log("data order",createdOrder)
        await createdOrder.save();
        //console.log("order created ",createdOrder.id);
        res.json({orderId: createdOrder.id});
    }
    catch(err){
        console.log(err);
        return next(err);
    }

}
const getOrderDetails =async(req,res,next)=>{
    const {order_id}=req.params;
    //console.log("getOrderDetails:",order_id);
    const order=await Order.findOne({_id:order_id});
    //console.log("order details:",order);

    if (!order)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:order});
}

const getItemDetails =async(req,res,next)=>{
    const {order_id, item_id}=req.params;
    //console.log("getItemDetails:",order_id, item_id);
    const item=await Order.findOne({_id:order_id},
                                    { items: { $elemMatch: {id:item_id} } } // Use $elemMatch to project only the matching item
    );
    console.log("item details:", item);

    if (!item)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:item});
}

const getOrder=async(req,res,next)=>{
    const {order_id}=req.params;
    console.log(order_id);
    const orderitems=await Order.find({rzr_payment_id:order_id}).select('items');
    console.log("order:",orderitems);
    if(!orderitems)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:orderitems});
}

const getClientOrders=async(req,res,next)=>{
    const {id}=req.params;
    console.log(id);

    const orderitems=await Order.find({client_id:id});
    //console.log("orders:",orderitems);
    if(!orderitems)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:orderitems});

}

const getActiveOrders=async(req,res,next)=>{
    const {id}=req.params;
    console.log(id);

    const orderitems=await Order.find({client_id:id,status: { $ne: 'closed' }});
    console.log("orders:",orderitems);
    if(!orderitems)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:orderitems});

}

const setPaymentId=async(req,res,next)=>{
    const {id,order_date,order_id,rzr_payment_id,customer_data,status} = req.body;
    console.log("from orders setPaymentId function",id,order_date,order_id,rzr_payment_id,customer_data,status);
         try{
            const updatedOrder=await Order.findByIdAndUpdate(id,{order_date:order_date,order_id:order_id,rzr_payment_id:rzr_payment_id,customer_details:customer_data,status:status});
            res.json({success:true,message:'Order details updated'});
        }
        catch(error){
            console.log(error.message);
            const message="Could not update order details";
            res.json({success:false,message:message})
            //return next(error);
        }
    }

const updateStatus=async(req,res,next)=>{
    const {orderId, client_id, items,status, update_date,status_update} = req.body;
    console.log("from orders updateStatus function ",orderId, client_id, items, status, update_date, status_update);
    try {
        for (const item of items) {
          const order = await Order.findOneAndUpdate(
            { _id: orderId, client_id: client_id}, // Adding 'items.id': item.id here
            {
              $set: { 'items.$[elem].item_status': status, 'items.$[elem].update_date': update_date },
              $push: { 'items.$[elem].status_updates': status_update }
            },
            {
              arrayFilters: [{ 'elem.id': item }], // 'elem.id' refers to the same 'item.id' in the array filter
              new: true,
              returnOriginal: false
            }
          );

          if (!order) {
            console.log(`Order ${orderId} or Item ${item} not found`);
            continue;
          }
        console.log(`Updated Order ${orderId}, Item ${item} to status ${status}`);
        }

        res.json({ success: true, message: 'Order statuses updated' });

      } catch (error) {
        console.error('Error updating item status:', error);
        res.status(500).json({ success: false, message: "Could not update status" });
      }
    }




const abortOrder=async(req,res,next)=>{

  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'aborted';
    await order.save();

    res.status(200).json({ message: 'Order status updated to aborted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

const cancelOrder=async(req,res,next)=>{

  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order status updated to cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteOrder(req,res,next){
    const {id} = req.body;
    const deletedOrder=await Order.deleteOne({_id:id});
    if(!deletedOrder){
        const error= new Error("Could not delete Order");
        return next(error);
    }
   // console.log("deleted cart item with id ",deletedItem);
    await order.save();
    res.json(deletedOrder);
}



exports.createOrder=createOrder;    //creates a new Order
exports.abortOrder=abortOrder;      //aborts an order if transaction is aborted from checkout page
exports.deleteOrder=deleteOrder;    //if payment form is cancelled
exports.cancelOrder=cancelOrder;    //if order is cancelled after successful payment
exports.getActiveOrders=getActiveOrders;
exports.getOrder=getOrder;
exports.setPaymentId=setPaymentId;
exports.updateStatus=updateStatus;
exports.getClientOrders=getClientOrders;
exports.getOrderDetails=getOrderDetails;
exports.getItemDetails=getItemDetails;