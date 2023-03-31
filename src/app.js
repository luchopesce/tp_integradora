import express from "express";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";

const app = express();
export const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

app.engine("handlebars", engine());

app.set("server", httpServer);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(express.json());
app.use(express.static(__dirname + "/../src/public"));

//routes
app.use("/", viewsRouter);
app.use("/products", viewsRouter);
app.use("/messages", viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

mongoose
  .connect(
    "mongodb+srv://luchopesce96:chacabuco14@codercluster.r8atrkr.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log("Connected to DB");
  });

