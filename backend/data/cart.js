const Cart=require("../models/cart");

async function get(req,res,next){
     if(!req.params.id) {
       // console.log("para is ",req.params.id);
        const error= new Error("Could not fetch Cart");
        next(error);
     }
     try{
    // console.log(req.params.id);

     let cart;
    // console.log("fetching cart item:", req.params.id);
         cart=await Cart.findOne({_id:req.params.id});
        // console.log("cart item:",cart);
         if(cart)
            res.json({success:true,data:cart,message:'Item fetched'});
         else
        res.json({success:false,data:null,message:'Item not found'});
     }
     catch(err){
       // console.log("error",err.message);
        res.json({success:false,data:null,message:err.message});
       // return next(err);
     }
}

async function put(req,res,next){
    item=await Cart.findOne({_id:req.params.id});
    if(!item) return;
   const {items, totalQuantity, totalAmount}=req.body;
    //console.log("from data PUT "+req.params.id);
    const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{items, totalQuantity, totalAmount},{ new: true });
   // console.log("updated cart: "+updatedCart);
    if(!updatedCart){
        const error= new Error("Could not update Cart");
        console.log(error);
        return next(error);
    }
    //console.log("updated Cart",updatedCart,"======");
    res.json({success:true,message:"Cart updated"});
}

async function post(req,res,next){

    const {items,totalQuantity, totalAmount}=req.body;
    const createdItem=new Cart({items, totalQuantity, totalAmount});
    try{
        await createdItem.save();
    }
    catch(err){
        //const error= new Error("Could not add to Cart");
        return next(err);
    }
    //console.log("in cart data ",createdItem.id);
    res.json(createdItem);
    /*res.json({
        cart_id: createdItem.id,
        items: createdItem.items,
        totalQuantity: createdItem.totalQuantity
    });*/

}

async function deleteCart(req,res,next){
    const {id} = req.params;
    const deletedItem=await Cart.deleteOne({_id:id});
    if(!deletedItem){
        const error= new Error("Could not delete Cart");
        return next(error);
    }
   // console.log("deleted cart item with id ",deletedItem);
    res.json(deletedItem);
}

exports.get=get;
exports.put=put;
exports.post=post;
exports.deleteCart=deleteCart;
//exports.patch=patch;