import { Router } from "express";
import {
  ProductManager,
  config,
  MessageManager
} from "../dao/index.js";
import {Server } from "socket.io"

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const { app } = req;
  const io = new Server (app.get("server"));
  const products = await productManager.getProducts();

  io.on("connection", () => {
    io.emit("list-products", products);
  });

  res.render("home");
});

router.get("/products", async (req, res) => {
  const { app } = req;
  const io = new Server (app.get("server"));
  const products = await productManager.getProducts();

  io.on("connection", () => {
    io.emit("list-products", products);
  });

  res.render("products");
});

if (config.presistenceType === "db") {
  router.get("/messages", async (req, res) => {
    const { app } = req;
    const io = new Server (app.get("server"));
    const messageManager = new MessageManager()
    const messages = await messageManager.getMessages()
    
io.on("connection", (socket) => {
  console.log(`New client connected with id:${socket.id}`);
    socket.on("new-user", (username) => {
      socket.emit("messages", messages);
      socket.broadcast.emit("new-user", username);
    });

    socket.on("chat-message", async (data) => {
      await messageManager.createMessage(data, io)
    }); 
});

    res.render("messages");
  });
}

export default router;
