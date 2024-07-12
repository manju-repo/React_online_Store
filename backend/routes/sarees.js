const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const { getAll, get, add, put, remove } = require('../data/saree');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();



router.get('/:saree_id', async (req, res, next) => {
    const saree_id=req.params.saree_id;
console.log("id in routes:"+saree_id);

    try {
        const item = await get(saree_id);
        res.json(item);
    } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
console.log('saree routes');
  try {
    const items = await getAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);
router.delete('/:id', remove);
router.post('/',add);
router.put('/:id',put);

module.exports = router;
