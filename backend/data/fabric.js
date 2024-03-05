const Fabric = require("../models/fabric"); // Create the Item model


async function getAll() {

  const fabrics=await Fabric.find();

  if (!fabrics) {
    throw new NotFoundError('Could not find Data.');
  }
  return fabrics;
}

async function get(id) {
       const fabric=await Fabric.findOne({Fabid:id});
  if (!fabric) {
    throw new NotFoundError('Could not find any data.');
  }
  //console.log(fabric);
  return fabric;
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