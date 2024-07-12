const express = require('express');
const checkAuth=require('../middleware/checkAuth');

const  {get, put, post, deleteCart} = require('../data/cart');

const router=express.Router();

router.get('/:id',get);
router.put('/:id',put);
router.post('/',post);
router.delete('/:id',deleteCart);


module.exports = router;
