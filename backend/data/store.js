const store=require("../models/store");

const lowStockAlert=async(req,res,next)=>{
    const {id,size} = req.body;
    console.log("update stock ",id,size);
    try{
        const item = await store.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }


            const updatedStock=await store.findOneAndUpdate(
                {_id:id},
                { $addToSet: { low_stock: size }}, // Push the size into low_stock array
                { new: true}
            );

            console.log("alert set", updatedStock);
            res.json({success:true, message:'alert flag set', data:updatedStock});
        }
        catch(error){
            console.log(error);
            const message="Could not set flag";
            res.json({success:false,message:message})
            //return next(error);
        }
    }


const updateStock=async(req,res,next)=>{
    const {id,quantity,size} = req.body;
    console.log("update stock ",id,quantity,size, [`size.size${size}`]);
    try{
        const item = await store.findById(id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        // Convert sizes to integers if they are not already
        const updatedSizes = {
            sizeXS: item.size.sizeXS ? parseInt(item.size.sizeXS, 10) : 0,
            sizeS: item.size.sizeS ? parseInt(item.size.sizeS, 10) : 0,
            sizeM: item.size.sizeM ? parseInt(item.size.sizeM, 10) : 0,
            sizeL: item.size.sizeL ? parseInt(item.size.sizeL, 10) : 0,
            sizeXL: item.size.sizeXL ? parseInt(item.size.sizeXL, 10) : 0,
            sizeXXL: item.size.sizeXXL ? parseInt(item.size.sizeXXL, 10) : 0,
        };

            const updatedStock=await store.findByIdAndUpdate(
                {_id:id, stock: { $gt: 0 }},
                {
                    $inc:{
                        stock:-quantity,
                        [`size.size${size}`]: -quantity,
                     },
                    $set: updatedSizes,
                },
                { new: true, useFindAndModify: false }
            );

            console.log("stocks updated", updatedStock);
            res.json({success:true, message:'Stock updated', data:updatedStock});
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

const getSimilarProducts=async(req,res,next)=>{
   const {product_code}=req.params;
       console.log(product_code);
     try{
            const products = await store.find({ product_code: { $regex: `^${product_code}` } });
           //console.log("prod details:", details);
           if(!products)
               res.json({success:false, data:null});
           else
               res.json({success:true, data:products});
       }catch(error){
           console.log(error.message);
       }
}


exports.updateStock=updateStock;
exports.checkStock=checkStock;
exports.getProductDetails=getProductDetails;
exports.getProducts=getProducts;
exports.getSimilarProducts=getSimilarProducts;
exports.lowStockAlert=lowStockAlert;