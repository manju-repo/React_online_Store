const express = require('express');

const {add, remove, getAdminOrders, changeOrderStatus} = require('../data/vendor');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/adminOrders/:id', (req, res, next) => {
 if (!req.userData) {
   return res.status(403).json({ success: false, message: 'Forbidden' });
 }
  if (req.userData.userType !== 'admin' || req.userData.userId !==req.params.id ) {
     const error = new Error("You are not an authorized user");
     return next(error);
 }
 next();
}, getAdminOrders);

router.post('/changeOrderStatus/:id', (req, res, next) => {
 if (!req.userData) {
   //return res.status(403).json({ success: false, message: 'Forbidden' });
   return next(error);
 }
  if (req.userData.userType !== 'admin' || req.userData.userId !==req.params.id ) {
      const error = new Error("You are not an authorized user");
      return next(error);
  }
 next();
}, changeOrderStatus);

router.post('/', add);
router.delete('/:id', remove);
module.exports = router;
