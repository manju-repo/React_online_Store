const Bestseller = require("../models/Bestseller"); // Create the Item model


async function get() {

  const items=await Bestseller.find();
  if (!items) {
    throw new NotFoundError('Could not find Data.');
  }

  return items;
}
exports.get=get;
