const express = require('express');
const auth2FA = require('../middleware/Auth2FA');
const checkAuth = require('../middleware/checkAuth');

const { createOrder, abortOrder, getOrder, getActiveOrders, setPaymentId, updateStatus, getClientOrders, getOrderDetails, getItemDetails} = require('../data/orders');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/:order_id', getOrder);

router.get('/clientOrders/:id',checkAuth, (req, res, next) => {
 if (!req.userData) {
   return res.status(403).json({ success: false, message: 'Forbidden' });
 }
 next();
}, getClientOrders);


router.post('/', createOrder);
router.put('/abort', abortOrder);
router.get('/getActiveOrders/:id', getActiveOrders);
router.put('/updateStatus', updateStatus);
router.put('/', setPaymentId);
router.get('/orderDetails/:order_id',getOrderDetails);
router.get('/itemDetails/:order_id/:item_id',getItemDetails);
module.exports = router;
