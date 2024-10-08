const express = require('express');
const checkAuth = require('../middleware/checkAuth');

const {notifyUser, checkSubscription} = require('../data/subscription');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.post('/notifyMe/:productId', checkAuth, notifyUser);
router.get('/checkSubscription/:productId', checkSubscription);
module.exports = router;
