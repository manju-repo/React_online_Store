const Fabric = require("../models/store"); // Create the Item model
const path = require('path');
const config=require('dotenv').config({ path: "./config/config.env"});
if (config.error) {
  console.error("Error loading .env file:", config.error);
  process.exit(1); // Exit the application if there is an error loading the .env file
}

const getAll=async(req,res,next)=> {
      const fabrics=await Fabric.find({category:'fabrics'});

      if (!fabrics) {
        throw new NotFoundError('Could not find Data.');
      }
     return fabrics;
}

async function getCollection(sub_category) {
    const fabrics=await Fabric.find({category:'fabrics',sub_category:sub_category});

     if (!fabrics) {
        throw new NotFoundError('Could not find Data.');
     }
     return fabrics;
}

async function get(id) {
  const fabric=await Fabric.findOne({_id:id});
  if (!fabric) {
    throw new NotFoundError('Could not find any data.');
  }
  return fabric;
}

const remove=async(req,res,next)=>{
//console.log(req.userData.userType);
     if (req.userData.userType !== 'admin'){
       return res.status(403).json({success:false,message:'You are not authorized to delete items'});
       }
    const {id}=req.params;
    try{
        const deletedFabric=await Fabric.deleteOne({_id:id});
        if(!deletedFabric){
            throw new Error("Could not delete fabric");
        }
        res.json({success:true, message: 'Fabric deleted.' });
     }
     catch(error){
        console.log(error);
        res.json({success:false, message: 'Could not delete Fabric.' });
     }
};

const add=async(req,res,next)=>{
    if (req.userData.userType !== 'admin'){
       return res.status(403).json({success:false,message:'You are not authorized to add items'});
    }
    const {product_code,category,sub_category,type,image,desc,colour, price,size,maxSize, stock, details,created_by} = req.body;
    const createdItem=new Fabric({product_code,category, sub_category, type, image, desc, colour, price, size, maxSize, stock, details, created_by});
    try{
        await createdItem.save();
    }
    catch(error){
        return next(error);
    }
    res.status(201).json({success:true, message:'item created', data:createdItem.id});
};

const adminStockUpdate=async(req,res,next)=>{
    if (req.userData.userType !== 'admin'){
       return res.status(403).json({success:false,message:'You are not authorized to add items'});
    }
    const {size,stock}=req.body;
    const id=req.params.id;
    console.log("from adminStockUpdate",id, size, stock);
    try{
        const updatedItem=await Fabric.findByIdAndUpdate(id,
                   {
                         $set:{size:size,stock:stock}
                   },
                   {new:true});

        if (!updatedItem) {
           return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.status(201).json({success:true, message:'item updated', data:updatedItem});
    }
    catch(error){
        console.log(error);
        //return next(error);
    }
}

async function update(req,res,next){
console.log('in put');
    const {product_code,category,sub_category,type,desc,price,colour,size, maxSize, stock, min_stock, details,created_by}=req.body;
    const id=req.params.id;
        const images = [];

     if (req.files) {
        for (let i = 1; i <= 5; i++) {
            const imageKey = `image${i}`;
            if (req.files[imageKey] && req.files[imageKey][0]) {
                // Construct the image URL
                const filePath = req.files[imageKey][0].path.replace(/\\/g, '/'); // Replace backslashes on Windows
                const imageUrl = `${process.env.API_BASE_URL}/${filePath}`;
                images.push(imageUrl);
            }
        }
    }

    //const images = req.files ?req.files.map(file=> `${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}`): [];
//console.log(`${process.env.API_BASE_URL}/${req.file.path.replace(/\\/g, '/')}`);
    console.log("from data PUT "+id, category,sub_category,type,desc,colour,size,details,stock,min_stock,created_by,price,images);
   try{
        const updatedItem=await Fabric.findByIdAndUpdate(id,{product_code:product_code, category:category, sub_category:sub_category, type:type, desc:desc, colour:colour,
        size:size, maxSize:maxSize, price:price, stock:stock, min_stock:min_stock, details:details, image:images.length > 0 ? images : undefined, created_by:created_by},{new:true});
        res.status(201).json({success:true, message:'item updated', data:updatedItem.id});
    }
    catch(error){
        console.log(error);
        //return next(error);
    }
}

exports.getAll = getAll;
exports.getCollection=getCollection;
exports.get = get;
exports.remove = remove;
exports.add = add;
exports.update = update;
exports.adminStockUpdate=adminStockUpdate;