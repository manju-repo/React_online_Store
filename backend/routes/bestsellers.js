const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const { get } = require('../data/bestseller');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();



router.get('/', async (req, res, next) => {
//console.log('bs routes');
  try {
    const collections = await get();
    //console.log("res from bs routes"+collections);
    res.json(collections);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
