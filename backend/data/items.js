const Item = require("../models/Categories"); // Create the Item model


async function getAll() {

  const items=await Item.find();
  if (!items) {
    throw new NotFoundError('Could not find Data.');
  }
  return items;
}

async function get(cat_id) {
       const item=await Item.findOne({category_id:cat_id});
  if (!item) {
    throw new NotFoundError('Could not find any data.');
  }
  return item;
}

/*
async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.events.filter((ev) => ev.id !== id);
  await writeData({events: updatedData});
}
*/
exports.getAll = getAll;
exports.get = get;
/*
exports.add = add;
exports.replace = replace;
exports.remove = remove;
*/