import FileProductManager from "./file-managers/product.manager.js";
import FileCartManager from "./file-managers/cart.manager.js";
import FileMessageManager from "./file-managers/message.manager.js";
import DbProductManager from "./db-managers/product.manager.js";
import DbCartManager from "./db-managers/cart.manager.js";
import DbMessageManager from "./db-managers/message.manager.js";
import __dirname from "../utils.js";

const pathProducts = `${__dirname}/dao/file-managers/files/products.json`;
const pathCart = `${__dirname}/dao/file-managers/files/cart.json`;
const pathMessage = `${__dirname}/dao/file-managers/files/message.json`;

const config = {
  presistenceType: "db",
};

let ProductManager, CartManager, MessageManager;

if (config.presistenceType === "db") {
  ProductManager = DbProductManager;
  CartManager = DbCartManager;
  MessageManager = DbMessageManager;
} else if (config.presistenceType === "file") {
  ProductManager = FileProductManager;
  CartManager = FileCartManager;
  MessageManager = FileMessageManager;
} else {
  throw new Error("Unkwon, presistence type");
}

export {
  ProductManager,
  CartManager,
  MessageManager,
  pathProducts,
  pathCart,
  pathMessage,
};
