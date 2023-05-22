import { Router } from "express";
import { ProductManager, config, CartManager } from "../dao/index.js";
import { authenticate, authorize } from "../middlewares/authenticate.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const { app } = req;
  const io = app.get("io");
  const products = await productManager.getProducts();

  io.on("connection", () => {
    io.emit("list-products", products);
  });

  res.render("home");
});

router.get("/products", authenticate("jwt"), async (req, res) => {
  const { app } = req;
  const io = app.get("io");
  const user = req.user;

  io.on("connection", async (socket) => {
    let options = {
      lean: true,
      limit: 2,
      sort: { price: "asc" },
    };
    socket.on("page", async (data) => {
      if (data) {
        options.page = data;
      }
      const paginate = await productManager.paginateProducts({}, options);
      io.emit("list-products", paginate);
    });
    const paginate = await productManager.paginateProducts({}, options);
    io.emit("list-products", paginate);
  });

  res.render("products", user);
});

router.get("/carts/:cid", async (req, res) => {
  const { app } = req;
  const io = app.get("io");
  const { cid } = req.params;
  const carts = await cartManager.getCartById(cid);

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

router.get("/cookies", async (req, res) => {
  res.render("cookies");
});

router.get("/login", authenticate("jwt"), async (req, res) => {
  const user = req.user
  if(user){
    res.redirect("/perfil");
  } else {
    res.render("login");
  }
});

router.get("/forgot", async (req, res) => {
  const user = req.user
  if(user){
    res.redirect("/perfil");
  } else {
    res.render("forgot");
  }
});

router.get("/perfil", authenticate("jwt"), async (req, res) => {
  const user = req.user
    if(user){
      res.render("perfil", user);
    }else{
      res.redirect("/login")
    }
});

router.get("/current", authenticate("jwt"), async (req, res) => {
  const user = req.user
    if(user){
      return res.json({UsuarioActual: user});
    }else{
      res.redirect("/login")
    }
});

router.get("/registro", authenticate("jwt"), async (req, res) => {
  const user = req.user
  if(user){
    res.redirect("/perfil");
  } else {
    res.render("registro");
  }
});

export default router;
