import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },    
    stock: {
        type: Number,
        required: true
    },   
    category: {
        type: String,
        required: true
    },    
    thumbnail: {
        type: Array,
        default: []
    } 
})

const productModel = mongoose.model("products", productsSchema)
export default productModel