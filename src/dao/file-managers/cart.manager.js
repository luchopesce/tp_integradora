import fs from "fs";
import { pathCart } from "../index.js";
import { getNextId } from "../../utils.js";
import { ProductManager} from "../index.js";

export default class CartManager{
  #productManager = new ProductManager();
  constructor() {
    console.log("Working with cart using filesystem");
  }

  getCarts = async () => {
    if (fs.existsSync(pathCart)) {
      const carts = await fs.promises.readFile(pathCart, "utf-8");
      return JSON.parse(carts);
    }
    return [];
  };

  getCartById = async (id) => {
    const carts = await this.getCarts();
    id = Number(id);
    const cartExist = carts.find((thisCart) => thisCart.id === id);
    if (cartExist) {
      return cartExist;
    } else {
      return;
    }
  };

  deleteCart = async (id) => {
    const carts = await this.getCarts();
    id = Number(id);
    if (carts.some((thisCart) => thisCart.id === id)) {
      const cartDelete = carts.filter((thisCart) => thisCart.id !== id);
      await fs.promises.writeFile(pathCart, JSON.stringify(cartDelete));
      return cartDelete;
    } else {
      return;
    }
  };

  createCart = async () => {
    const carts = await this.getCarts();
    const newId = await getNextId(carts);

    const newCart = {
      id: newId,
      products: []
    };

    const arrCart = [...carts, newCart];
    await fs.promises.writeFile(pathCart, JSON.stringify(arrCart));
    return newCart;
  };

  async addProductToCart(cartId, productId) {
    productId = Number(productId)
    cartId = Number(cartId)
    const product = await this.#productManager.getProductById(productId)
    const carts = await this.getCarts();

    if(product && carts.some((thisCart) => thisCart.id === cartId)){
      const addProduct = carts.map((thisCart) => {
        if (thisCart.id === cartId) {
          const cartProducts = thisCart.products;
          const cartCheckProduct = cartProducts.find(
            (thisCartProduct) => thisCartProduct.product === productId
          );
          if (cartCheckProduct) {
            cartCheckProduct.quantity++;
            thisCart = {
              ...thisCart,
              id: cartId,
              products: [...cartProducts],
            };
          } else {
            thisCart = {
              ...thisCart,
              id: cartId,
              products: [...cartProducts, { product: productId, quantity: 1 }],
            };
          }
        }
        return thisCart;
      });
      await fs.promises.writeFile(pathCart, JSON.stringify(addProduct));
      return addProduct
    }
    else{
      return
    }
  }

  sendMessage = async (app) => {
    const io = app.get("io");
    const carts = await this.getCarts();
    io.emit("list-cart", carts);
  };
}
