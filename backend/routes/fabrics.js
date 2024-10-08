const express = require('express');
const {multipleUpload}

 = require('../middleware/multer'); // Import the configured multer middleware
const checkAuth = require('../middleware/checkAuth');

const { getAll,getCollection, get, add, update, remove, adminStockUpdate } = require('../data/fabric');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const router = express.Router();



router.get('/:fabric_id', async (req, res, next) => {
//console.log("in routes with id");
    const fabric_id=req.params.fabric_id;
//console.log("id in routes:"+fabric_id);

    try {
        const fabric = await get(fabric_id);
        res.json(fabric);
    } catch (error) {
    next(error);
  }
});
/*router.get('/subcategory=:subcategory_id', async (req, res, next) => {

    const {subcategory_id}=req.params;
console.log("id in routes with subcat:"+subcategory_id);

    try {
        const collection = await getCollection(subcategory_id);
            console.log(collection);

        res.json({success:true,data:collection});
    } catch (error) {
    console.log(error,message);
    next(error);
  }
});*/

router.get('/', async (req, res, next) => {
  const sub_category = req.query.sub_category;

  try {
  let fabrics=null;
  if(sub_category)
     fabrics=await getCollection(sub_category);
  else
     fabrics = await getAll();
    //console.log("res from /:"+fabrics);
    res.json(fabrics);
  } catch (error) {
  console.log(error);
    next(error);
  }
});

//router.use(checkAuth);
router.delete('/:id', checkAuth, remove);

router.post('/', checkAuth, add);
//console.log(multipleUpload); // Log the multipleUpload to check what it contains
router.put('/adminStockUpdate/:id', checkAuth, adminStockUpdate);
router.put('/:id', checkAuth, multipleUpload, update);
module.exports = router;
