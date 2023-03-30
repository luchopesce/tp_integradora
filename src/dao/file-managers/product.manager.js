import fs from "fs";
import { pathProducts } from "../index.js";
import { getNextId } from "../../utils.js";

export default class ProductManager {
  constructor() {
    console.log("Working with products using filesystem");
  }

  getProducts = async () => {
    if (fs.existsSync(pathProducts)) {
      const products = await fs.promises.readFile(pathProducts, "utf-8");
      return JSON.parse(products);
    }
    return [];
  };

  getProductById = async (id) => {
    const products = await this.getProducts();
    id = Number(id);
    const productExist = products.find(
      (thisProducts) => thisProducts.id === id
    );
    if(productExist){
      return productExist;
    }else{
      return
    }
  };

  updateProduct = async (id, obj) => {
    const products = await this.getProducts();
    id = Number(id);
    if (products.some((thisProducts) => thisProducts.id === id)) {
      const productUpdate = products.map((thisProducts) => {
        if (thisProducts.id === id) {
          thisProducts = { ...thisProducts, ...obj, id: id };
        }
        return thisProducts;
      });
      await fs.promises.writeFile(pathProducts, JSON.stringify(productUpdate));
      return productUpdate;
    } else {
      return;
    }
  };

  deleteProduct = async (id) => {
    const products = await this.getProducts();
    id = Number(id);
    if (products.some((thisProducts) => thisProducts.id === id)) {
      const productDelete = products.filter(
        (thisProducts) => thisProducts.id !== id
      );
      await fs.promises.writeFile(pathProducts, JSON.stringify(productDelete));
      return productDelete;
    } else {
      return;
    }
  };

  createProduct = async (objProduct) => {
    const products = await this.getProducts();
    const newId = await getNextId(products);

    const newProduct = {
      id: newId,
      status: true,
      ...objProduct,
    };

    const arrProducts = [...products, newProduct];
    await fs.promises.writeFile(pathProducts, JSON.stringify(arrProducts));
    return newProduct;
  };

  sendMessage = async (app) => {
    const io = app.get("io");
    const products = await this.getProducts();
    io.emit("list-products", products);
  };
}
