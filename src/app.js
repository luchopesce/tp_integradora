import express from "express";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import { Server } from "socket.io";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
const io = new Server(httpServer);

app.engine("handlebars", engine());

app.set("io", io);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.static(__dirname + "/../src/public"));

//routes
app.use("/", viewsRouter);
app.use("/products", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

mongoose
  .connect(
    "mongodb+srv://luchopesce96:chacabuco14@codercluster.r8atrkr.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log("Connected to DB");
  });

io.on("connection", (socket) => {
  console.log(`New client connected with id:${socket.id}`);
});
