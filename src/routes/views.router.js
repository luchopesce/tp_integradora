import { Router } from "express";
import { ProductManager, config } from "../dao/index.js";

const router = Router();
const productManager = new ProductManager();

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

  // const { page } = req.query;
  // const products = await productManager.getProducts();
  // console.log(paginate)

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

if (config.presistenceType === "db") {
  router.get("/messages", (req, res) => {
    res.render("messages");
  });
}

export default router;
