import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            quantity: {
                type: Number,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"products",
            },
            insertProduct:{
                type: Object,
            }
        }],
        default: []
    },
})

// Agregando middleware a la funcion findOne

cartSchema.pre("findOne", function(){
    this.populate("products.product")
});

const cartModel = mongoose.model("cart", cartSchema)
export default cartModel