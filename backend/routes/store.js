const express = require('express');

const {updateStock, checkStock, getProducts, getProductDetails, getSimilarProducts, lowStockAlert} = require('../data/store');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/', getProducts);
router.get('/:product_id', getProductDetails);
router.get('/variants/:product_code',getSimilarProducts);
router.get('/stock/:product_id', checkStock);
router.put('/stock', updateStock);
router.put('/lowStockAlert', lowStockAlert);
module.exports = router;
