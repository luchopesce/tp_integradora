import productModel from "../models/product.model.js";

let arrOptions = []
export default class ProductManager {
  constructor() {
    console.log("Working with products using dbsystem");
  }

  getProducts = async () => {
    const products = await productModel.find().lean();
    return products;
  };

  getProductById = async (id) => {
    const product = await productModel.findOne({ _id: id });
    return product;
  };

  deleteProduct = async (id) => {
    const deleteProduct = await productModel.findByIdAndDelete({ _id: id });
    return deleteProduct;
  };

  updateProduct = async (id, obj) => {
    const updateUser = await productModel.findOneAndUpdate({ _id: id }, obj, {
      new: true,
    });
    return updateUser;
  };

  createProduct = async (objProduct) => {
    const newProduct = await productModel.create(objProduct);
    return newProduct;
  };

  // queryData = async () => {
  //   const response = await productModel
  //     .find({ stock: 15 })
  //     .explain("executionStats");
  //   console.log(response.executionStats);
  // };

  paginateProducts = async (query, options) => {
    arrOptions = options
    const paginate = await productModel.paginate(query, options);
    return paginate;
  };

  sendMessage = async (app) => {
    const io = app.get("io");
    const paginate = await this.paginateProducts({}, arrOptions);
    io.emit("list-products", paginate);
  };
}
