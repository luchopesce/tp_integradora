import productModel from "../models/product.model.js"

export default class ProductManager {
  constructor(){
      console.log("Working with users using dbsystem")
  }

  getProducts = async () => {
    const products = await productModel.find().lean()
    return products
  }

  getProductById = async (id) => {
    const product = await productModel.findOne({_id: id})
    return product
  }

  deleteProduct = async (id) => {
   const deleteProduct = await productModel.findByIdAndDelete({ _id: id})
   return deleteProduct
  }

  updateProduct = async (id, obj) => {
    const updateUser = await productModel.findOneAndUpdate(
      { _id: id},
      obj,          
      { new: true}
    );
    return updateUser
  }

  createProduct = async (objProduct) => {
    const newProduct = await productModel.create(objProduct)
    return newProduct
  }

  sendMessage = async (app) => {
    const io = app.get("io");
    const products = await this.getProducts();
    io.emit("list-products", products);
  }
}
