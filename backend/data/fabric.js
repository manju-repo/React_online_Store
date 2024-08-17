const Fabric = require("../models/store"); // Create the Item model


async function getAll() {
  const fabrics=await Fabric.find({category:'fabrics'});

  if (!fabrics) {
    throw new NotFoundError('Could not find Data.');
  }
  return fabrics;
}

async function getCollection(sub_category) {
  //console.log(sub_category);
  const fabrics=await Fabric.find({category:'fabrics',sub_category:sub_category});

  if (!fabrics) {
    throw new NotFoundError('Could not find Data.');
  }
  return fabrics;
}

async function get(id) {
   const fabric=await Fabric.findOne({_id:id});
   //console.log("fab:"+fabric);
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
    //console.log("in data ",id);

    const deletedFabric=await Fabric.deleteOne({_id:id});
    if(!deletedFabric){
        const error= new Error("Could not delete fabric");
        return next(error);
    }
         res.json({ message: 'Fabric deleted.' });
};

const add=async(req,res,next)=>{
    if (req.userData.userType !== 'admin'){
       return res.status(403).json({success:false,message:'You are not authorized to add items'});
    }
    const {product_code,category,sub_category,type,image,desc,colour,colour_options,stock,details,created_by} = req.body;
    const createdItem=new Fabric({product_code,category, sub_category, type, image, desc, colour, colour_options, price, stock, details, created_by});
    try{
        await createdItem.save();
    }
    catch(error){
        return next(error);
    }
    res.status(201).json({success:true, message:'item created', data:createdItem.id});
};

async function put(req,res,next){
const {product_code,category,sub_category,type,desc,price,image,colour,colour_options,stock, details,created_by}=req.body;
const id=req.params.id;
    //console.log("from data PUT "+id, category,sub_category,type,desc,colour,colour_options,details,stock,created_by,price,image);
   try{
        const updatedItem=await Fabric.findByIdAndUpdate(id,{product_code:product_code, category:category, sub_category:sub_category, type:type, desc:desc, colour:colour,
        colour_options:colour_options, price:price, stock:stock, details:details, image:image, created_by:created_by});
        res.status(201).json({success:true, message:'item updated', data:updatedItem.id});
    }
    catch(error){
        console.log(error.message);
        return next(error);
    }
}

exports.getAll = getAll;
exports.getCollection=getCollection;
exports.get = get;
exports.remove = remove;
exports.add = add;
exports.put = put;
