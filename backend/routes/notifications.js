const express = require('express');
const {upload} = require('../middleware/multer'); // Import the configured multer middleware
const checkAuth = require('../middleware/checkAuth');

const {  getNotifications, getNotification, getBanners, createNotification, updateNotification, getUSerNotifications, approveNotification, markAsRead} = require('../data/notifications');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();
router.get('/user',checkAuth, getUSerNotifications);
router.get('/banners', getBanners);
router.get('/', checkAuth, getNotifications);
router.get('/:id',checkAuth, getNotification);
router.post('/',checkAuth, upload.single('imageUrl'), createNotification);
router.put('/approve/:id', checkAuth, approveNotification);
router.patch('/markAsRead', checkAuth, markAsRead);
router.put('/:id', checkAuth,  upload.single('imageUrl'), updateNotification);

module.exports = router;
