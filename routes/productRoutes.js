const express = require("express");
const { getProducts, createProduct, storeProduct, editProduct, updateProduct, deleteProduct } = require("../controllers/admin/ProductController");
const adminAuthentication = require("../middleware/adminAuthentication");


const router = express.Router();

router.use(adminAuthentication);

router.get('/', getProducts);
router.get('/create', createProduct);
router.post('/', storeProduct);
router.get('/edit/:id', editProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
