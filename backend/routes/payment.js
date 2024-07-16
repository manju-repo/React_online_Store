const express = require('express');
const {createRazorpayAccount, checkout, paymentVerification, paymentTransfer, paymentRefund} = require('../data/payment');
const router = express.Router();
router.post('/createRazorpayAccount', createRazorpayAccount);
router.post('/checkout', checkout);
router.post('/paymentverification', paymentVerification);
router.post('/paymentTransfer', paymentTransfer);
router.post('/paymentRefund', paymentRefund);

module.exports = router;
