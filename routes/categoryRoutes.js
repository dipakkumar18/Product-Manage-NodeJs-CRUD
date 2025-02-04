const express = require("express");
const { getCategory, createCategory, storeCategory, editCategory, updateCategory, deleteCategory } = require("../controllers/admin/CategoryController");
const adminAuthentication = require("../middleware/adminAuthentication");


const router = express.Router();

router.use(adminAuthentication);

router.get('/',getCategory);
router.get('/create', createCategory);
router.post('/', storeCategory);
router.get('/edit/:id',editCategory);
router.put('/update/:id',updateCategory);
router.delete('/delete/:id',deleteCategory);


module.exports = router;
