const store=require("../models/store");



const updateStock=async(req,res,next)=>{
    const {id,quantity} = req.body;
    console.log("update stock ",id,quantity);
         try{
            const updatedStock=await store.findByIdAndUpdate({_id:id, stock: { $gt: 0 }},{ $inc:{stock:-quantity}},
                        { new: true, useFindAndModify: false });
            console.log("stocks updated", updatedStock);
            res.json({success:true,message:'Stock updated', data:updatedStock});
        }
        catch(error){
            console.log(error);
            const message="Could not update stock";
            res.json({success:false,message:message})
            //return next(error);
        }
    }

const checkStock=async(req,res,next)=>{
    const {product_id}=req.params;
    console.log(product_id);
  try{
    const stock=await store.findOne({_id:product_id}).select('stock');
    console.log("stock:",stock);
    if(!stock)
        res.json({success:false, data:null});
    else
        res.json({success:true, data:stock});
    }catch(error){
        console.log(error.message);
    }
}

const getProducts=async(req,res,next)=>{
     try{
           const products=await store.find();
          // console.log("products:", products);
           if(!products)
               res.json({success:false, data:null});
           else
               res.json({success:true, data:products});
       }catch(error){
           console.log(error.message);
       }
}


const getProductDetails=async(req,res,next)=>{
   const {product_id}=req.params;
       console.log(product_id);
     try{
           const details=await store.findOne({_id:product_id})
           //console.log("prod details:", details);
           if(!details)
               res.json({success:false, data:null});
           else
               res.json({success:true, data:details});
       }catch(error){
           //console.log(error.message);
       }
}


exports.updateStock=updateStock;
exports.checkStock=checkStock;
exports.getProductDetails=getProductDetails;
exports.getProducts=getProducts;
