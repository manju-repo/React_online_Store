const express = require('express');
const checkAuth = require('../middleware/checkAuth');

const {add, remove, getAdminOrders, changeOrderStatus, returnOrder} = require('../data/vendor');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/adminOrders/:id', checkAuth, (req, res, next) => {
 if (!req.userData) {
   return res.status(403).json({ success: false, message: 'Forbidden' });
 }
  if (req.userData.userType !== 'admin' || req.userData.userId !==req.params.id ) {
     const error = new Error("You are not an authorized user");
     return next(error);
 }
 next();
}, getAdminOrders);

router.put('/changeOrderStatus/:id', checkAuth, (req, res, next) => {
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

router.put('/returnOrder', returnOrder);
router.post('/', add);
router.delete('/:id', remove);
module.exports = router;
