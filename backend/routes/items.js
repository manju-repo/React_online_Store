const express = require('express');

const { getAll, get, add, replace, remove } = require('../data/items');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {

  try {
    const items = await getAll();
    //console.log("ITEMS:"+items);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  let {id}=req.params;

//console.log(id);
  try {
    const item = await get(id);
    res.json(item);
  } catch (error) {


    next(error);
  }
});

/*router.post('/', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.category)) {
    errors.category = 'Invalid category.';
  }

  if (!isValidText(data.desc)) {
    errors.desc = 'Invalid description.';
  }

  if (!isValidDate(data.colour)) {
    errors.colour = 'Invalid colour.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the fabric failed due to validation errors.',
      errors,
    });
  }

  try {
    await add(data);
    res.status(201).json({ message: 'fabric saved.', event: data });
  } catch (error) {
    next(error);
  }
});

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
