const express = require('express');

const  {get,put} = require('../data/cart');

const router=express.Router();

router.get('/',async (req,res,next)=>{
    try{
        const cart=await get();
                console.log("crt:"+cart);

        res.json(cart);
    }
    catch(error){
        next(error);
    }
});

router.put('/:id',async(req,res,next)=>{
    try{
    console.log("from routes"+ req.params.id+","+req.body.items[0].rate+","+req.body.items[1].rate);
        const cart=await put(req);
        console.log("added to cart");
        res.json(cart);
    }
    catch(error){
        next(error);
    }
});

module.exports = router;
