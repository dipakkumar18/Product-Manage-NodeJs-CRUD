const Category = require("../../models/Category");
const Product = require("../../models/Product");

const getCategory = async (req, res) => {
   try {
    const categories = await Category.find().populate('parent');
        res.render('categories/index',{categories});
   } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
   }
};

const createCategory = async (req, res) => {
    try {   
        const categories = await Category.find();
        res.render('categories/create', { categories });
    } catch (error) {
        res.status(500).send("Error retrieving categories");
    }
};

const storeCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const category = new Category({
            name,
            parent: parent === "null" ? null : parent,
        });
        await category.save();
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Error creating category");
    }
};

const editCategory = async (req,res) => {
    try {   
        const category = await Category.findById(req.params.id);
        const categories = await Category.find(); 
        if (!category) {
            return res.status(404).send("Category not found");
        }
        res.render("categories/edit", { category, categories });

    } catch (error) {
        res.status(500).send("Error retrieving categories");
    }
}

const updateCategory = async (req, res) => {
    try {
        const { name, parent } = req.body;
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.name = name || category.name;
        category.parent = parent === "null" ? null : parent; 
        await category.save();

        res.json({ message: "Category updated successfully", category });
    } catch (error) {
        console.log(error)
        res.status(500).send("Error updating category");
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const childCategory = await Category.findOne({ parent: categoryId });
        if (childCategory) {
            return res.status(400).send("This category can't be deleted because it has other subcategories.");
        }

        const productsInCategory = await Product.find({ category: categoryId });
        if (productsInCategory.length > 0) {
            return res.status(400).send("This category can't be deleted because there are products assigned to it.");
        }

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).send("Category not found");
        }

        res.status(200).send("Category deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting category");
    }
};

module.exports = {getCategory,createCategory,storeCategory,editCategory,updateCategory,deleteCategory};