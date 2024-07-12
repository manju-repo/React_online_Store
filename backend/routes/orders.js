const express = require('express');
const auth2FA = require('../middleware/Auth2FA');
const checkAuth = require('../middleware/checkAuth');

const { createOrder, getOrder, setPaymentId, updateStatus, getClientOrders} = require('../data/orders');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/:order_id', getOrder);
router.get('/clientOrders/:id', (req, res, next) => {
 // Example conditional check
 if (!req.userData) {
   return res.status(403).json({ success: false, message: 'Forbidden' });
 }
 next();
}, getClientOrders);
router.post('/', createOrder);
router.put('/updatestatus', updateStatus)
router.put('/', setPaymentId);

module.exports = router;
