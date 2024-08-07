const express = require('express');

const {updateStock, checkStock, getProductDetails} = require('../data/store');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/:product_id', getProductDetails);
router.get('/stock/:product_id', checkStock);
router.put('/stock', updateStock);

module.exports = router;
