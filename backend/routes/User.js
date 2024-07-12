const express = require('express');

const {  getUsers, getUser, signUp, login, setCartId, setWishlist, addOrder} = require('../data/user');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id',getUser);
router.post('/signup', signUp);
router.post('/login', login);
router.put('/cart', setCartId);
router.put('/wishlist', setWishlist);
router.put('/orders', addOrder);




module.exports = router;
