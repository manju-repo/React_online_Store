const Order=require("../models/order");


const createOrder=async(req,res,next)=>{
    const {items,totalQuantity,totalAmount,client_id}=req.body;
    console.log("adding order",items,totalQuantity,totalAmount,client_id);
    try{
        const createdOrder=new Order({items, totalQuantity, totalAmount, client_id});
        //console.log("data order",createdOrder)
        await createdOrder.save();
        console.log("order created ",createdOrder.id);
        res.json({orderId: createdOrder.id});
    }
    catch(err){
        console.log(err);
        return next(err);
    }

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

const setPaymentId=async(req,res,next)=>{
    const {id,order_id,rzr_payment_id,customer_data,status} = req.body;
    console.log("from data orders ",id,order_id,rzr_payment_id,customer_data,status);
         try{
            const updatedOrder=await Order.findByIdAndUpdate(id,{order_id:order_id,rzr_payment_id:rzr_payment_id,customer_details:customer_data,status:status});
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
    const {id,status} = req.body;
    console.log("from data orders ",id,status);
         try{
            const updatedOrder=await Order.findByIdAndUpdate(id,{status:status});
            res.json({success:true,message:'Order status updated'});
        }
        catch(error){
            console.log(error);
            const message="Could not update status";
            res.json({success:false,message:message})
            //return next(error);
        }
    }

exports.createOrder=createOrder;
exports.getOrder=getOrder;
exports.setPaymentId=setPaymentId;
exports.updateStatus=updateStatus;
exports.getClientOrders=getClientOrders;