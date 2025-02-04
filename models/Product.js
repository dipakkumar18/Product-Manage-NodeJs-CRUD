const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category" 
    },
    description: { 
        type: String 
    },
    amount: { 
        type: Number, 
        required: true },
    image: { 
        type: String 
    },
},{
    timestamps:true
});

module.exports = mongoose.model("Product", ProductSchema);
