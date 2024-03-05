const Cart=require("../models/cart");

async function get(){
    const cart=await Cart.find();
   console.log("in data after find-cart:"+cart);

    if(!cart)
        throw new NotFoundError("Could not find Cart");
    return cart;
}

async function put(req){
    var id='65e013b9b179e4c91593b330';
   console.log("from data PUT "+req.body.totalQuantity);
    const updatedCart=await Cart.findByIdAndUpdate(id,{items:req.body.items,totalQuantity:req.body.totalQuantity});
        console.log("after PUT");

    res.status(200).json(updatedCart);
}
exports.get=get;
exports.put=put;
//exports.patch=patch;