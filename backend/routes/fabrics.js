const express = require('express');

const { getAll, get, add, replace, remove } = require('../data/fabric');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();



router.get('/:fabric_id', async (req, res, next) => {
console.log("in routes with id");
    const fabric_id=req.params.fabric_id;
console.log("id in routes:"+fabric_id);

    try {
        const fabric = await get(fabric_id);
            console.log(fabric);

        res.json(fabric);
    } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
console.log("in route");

  try {
    const fabrics = await getAll();
    console.log("res from /:"+fabrics);
    res.json(fabrics);
  } catch (error) {
    next(error);
  }
});
/*
router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.json({ message: 'Fabric updated.', fabric: data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.json({ message: 'Fabric deleted.' });
  } catch (error) {
    next(error);
  }
});
*/
module.exports = router;
