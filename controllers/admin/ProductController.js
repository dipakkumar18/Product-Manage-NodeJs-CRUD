const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../../models/Product");
const Category = require("../../models/Category");

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          const uploadDir = './uploads';
          if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir); 
     },
     filename: (req, file, cb) => {
         const uniqueSuffix = Date.now();
         const extension = path.extname(file.originalname).toLowerCase();
         
         if (extension !== '.jpg' && extension !== '.jpeg' && extension !== '.png') {
             return cb(new Error('Only .jpg, .jpeg, and .png files are allowed.'));
         }
         
         cb(null, uniqueSuffix + extension); 
     }
});
 
 const upload = multer({
     storage: storage,
     limits: { fileSize: 10 * 1024 * 1024 }, 
 }).single('image'); 

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.render('products/index', { products });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

const createProduct = async (req, res) => {
     try {
         const categories = await Category.find();
         res.render('products/create', { categories });
     } catch (error) {
         res.status(500).send("Error retrieving categories");
     }
 };

 const storeProduct = async (req, res) => {
     upload(req, res, async (err) => {
          if (err) {
              return res.status(500).send("File upload failed: " + err.message);
          }
  
          const { title, category, description, amount } = req.body;
          
          let image = null;
          if (req.file) {
               image = req.file.filename;
          }
  
          try {
              const product = new Product({title,category,description,amount,image});
  
              await product.save();
              res.redirect('/products'); 
          } catch (error) {
              console.log(error);
              res.status(500).send("Error creating product");
          }
     });
 };

 const editProduct = async (req, res) => {
     try {
         const product = await Product.findById(req.params.id).populate('category');
         const categories = await Category.find();
         if (!product) {
             return res.status(404).send("Product not found");
         }
         res.render("products/edit", { product, categories });
     } catch (error) {
         res.status(500).send("Error retrieving product");
     }
 };
 
 const updateProduct = async (req, res) => {
 
     upload(req, res, async (err) => {
         if (err) {
             return res.status(500).send("File upload failed: " + err.message);
         }
 
         const { title, category, description, amount } = req.body;
         const product = await Product.findById(req.params.id);
         if (!product) {
             return res.status(404).json({ error: "Product not found" });
         }
 
         if (req.file) {
               const oldImagePath = `./uploads/${product.image}`;
               if (fs.existsSync(oldImagePath)) {
               fs.unlinkSync(oldImagePath);
               }
               product.image = req.file.filename;
          }
 
          product.title = title || product.title;
          product.category = category || product.category;
          product.description = description || product.description;
          product.amount = amount || product.amount;

         try {   
      
              await product.save();
              res.json({ success: true, message: "Product updated successfully" });

         } catch (error) {
               console.log(error);
               res.status(500).send("Error updating product");
         }
     });
 };

 const deleteProduct = async (req, res) => {
     try {
         const productId = req.params.id;
         const product = await Product.findByIdAndDelete(productId);
         if (!product) {
             return res.status(404).send("Product not found");
         }
 
         const imagePath = `./uploads/${product.image}`;
         if (fs.existsSync(imagePath)) {
             fs.unlinkSync(imagePath); 
         }
 
         res.status(200).send("Product deleted successfully");
     } catch (error) {
         res.status(500).send("Error deleting product");
     }
 };
 
 module.exports = { getProducts, createProduct, storeProduct, editProduct, updateProduct, deleteProduct };


 
