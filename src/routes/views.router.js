import { Router } from "express";
import { ProductManager, config, CartManager } from "../dao/index.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager()

router.get("/", async (req, res) => {
  const { app } = req;
  const io = app.get("io");
  const products = await productManager.getProducts();

  io.on("connection", () => {
    io.emit("list-products", products);
  });

  res.render("home");
});

router.get("/products", async (req, res) => {
  const { app } = req;
  const io = app.get("io");

  io.on("connection", async (socket) => {
    let options = {
      lean: true,
      limit: 2,
      sort: {price: "asc"}
    }
    socket.on("page", async (data) => {
      if(data){
        options.page = data
      }
      const paginate = await productManager.paginateProducts({}, options);
      io.emit("list-products", paginate);
    });
    const paginate = await productManager.paginateProducts({}, options);
    io.emit("list-products", paginate);
  });

  res.render("products");
});

router.get("/carts/:cid", async (req, res) => {
  const { app } = req;
  const io = app.get("io");
  const { cid } = req.params
  const carts = await cartManager.getCartById(cid);
  console.log(carts)

  // io.on("connection", async (socket) => {
  //   let options = {
  //     lean: true,
  //     limit: 10,
  //     sort: {price: "asc"}
  //   }
  //   socket.on("cart", async (data) => {
  //     if(data){
  //       options.page = data
  //     }
  //     const paginate = await cartManager.paginateCarts({}, options);
  //     io.emit("list-carts", paginate);
  //   });
  //   const paginate = await CartManager.paginateCarts({}, options);
  //   io.emit("list-carts", paginate);
  // });

  io.on("connection", () => {
    io.emit("list-carts", carts);
  });


  res.render("carts");
});

if (config.presistenceType === "db") {
  router.get("/messages", (req, res) => {
    res.render("messages");
  });
}

export default router;
