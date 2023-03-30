import { ProductManager } from "../index.js";
import cartModel from "../models/cart.model.js";

export default class CartManager {
  #productManager = new ProductManager();
  constructor() {
    console.log("Working with cart using dbsystem");
  }

  getCarts = async () => {
    const carts = await cartModel.find().lean();
    return carts;
  };

  getCartById = async (id) => {
    const cart = await cartModel.findOne({ _id: id });
    return cart;
  };

  deleteCart = async (id) => {
    const deleteCart = await cartModel.findByIdAndDelete({ _id: id });
    return deleteCart;
  };

  createCart = async () => {
    const newCart = await cartModel.create({ products: [] });
    return newCart;
  };

  addProductToCart = async (cartId, prodId) => {
    const cart = await this.getCartById(cartId);
    const product = await this.#productManager.getProductById(prodId);
    if (cart && product) {
      let addProduct;
      if (cart.products.some((thisCart) => thisCart.__prodId === prodId)) {
        addProduct = cart.products.map((thisCartMap) => {
          if (thisCartMap.__prodId === prodId) {
            return {
              ...thisCartMap,
              quantity: thisCartMap.quantity + 1,
            };
          }
          return thisCartMap;
        });
      } else {
        addProduct = [...cart.products, { __prodId: prodId, quantity: 1 }];
      }

      cart.products = addProduct;
      return cart.save();
    } else {
      return;
    }
  };

  sendMessage = async (app) => {
    const io = app.get("io");
    const carts = await this.getCarts();
    io.emit("list-cart", carts);
  };
}
