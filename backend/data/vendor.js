const Vendor=require("../models/vendor");

const add=async(req,res,next)=>{

    const {vendor_id,item_id,item_details,order_id,status,quantity,client_id,client_details} = req.body;
    console.log("vendor",vendor_id,item_id,item_details,order_id,status,quantity,client_id,client_details);
    const createdItem=new Vendor({vendor_id,item_id,item_details,order_id,status,quantity,client_id,client_details});
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
    console.log("in data ",id);

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
    if (req.userData.userType !== 'admin') {
        const error = new Error("You are not authorized user");
        return next(error);
    }

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
console.log("order items", orderItems[0].clientOrders[3]);
        if (!orderItems || orderItems.length === 0) {
            res.json({ success: false, data: null });
        } else {
            res.json({ success: true, data: orderItems });
        }
    } catch (err) {
        next(err);
    }
};

exports.add=add;
exports.remove=remove;
exports.getAdminOrders=getAdminOrders;
