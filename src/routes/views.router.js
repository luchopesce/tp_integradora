import {Router} from 'express'
import { ProductManager } from "../dao/index.js";

const router = Router()
const productManager = new ProductManager();

router.get('/', async (req, res)=>{
  const { app } = req;
  const io = app.get("io");
  const products = await productManager.getProducts();

  io.on("connection", () => {
    io.emit("list-products", products);
  });

    res.render('home')
})

router.get("/products", async (req, res) => {
    const { app } = req;
    const io = app.get("io");
    const products = await productManager.getProducts();
  
    io.on("connection", () => {
      io.emit("list-products", products);
    });
  
    res.render("products");
  });


export default router