const express = require('express');

const {add, remove, getAdminOrders} = require('../data/vendor');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();
router.get('/adminOrders/:id', (req, res, next) => {
 // Example conditional check
 if (!req.userData) {
   return res.status(403).json({ success: false, message: 'Forbidden' });
 }
 next();
}, getAdminOrders);
router.post('/', add);
router.delete('/:id', remove);

module.exports = router;
