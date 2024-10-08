const express = require('express');
const {upload} = require('../middleware/multer'); // Import the configured multer middleware
const checkAuth = require('../middleware/checkAuth');

const {  getUsers, getUser, getSubscriptions, signUp, login, setCartId, setWishlist, setSubscriptions, addOrder, createRazorpayAccount, update} = require('../data/user');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/subscriptions/:userId', getSubscriptions);
router.get('/subscriptions',checkAuth, getSubscriptions);
router.get('/:id',getUser);
router.get('/', getUsers);
router.post('/signup', upload.single('profileImage'), signUp); // Apply upload middleware here
router.post('/login', login);
router.put('/cart', setCartId);
router.put('/wishlist', setWishlist);
router.put('/orders', addOrder);
router.put('/subscriptions',checkAuth, setSubscriptions);
router.put('/:id', upload.single('profileImage'), update); // Apply upload middleware here
router.post('/createRazorpayAccount', createRazorpayAccount);




module.exports = router;
