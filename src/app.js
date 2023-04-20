import express from "express";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import cookiesRouter from "./routes/cookies.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import { config } from "./dao/index.js";
import { Server } from "socket.io";
import { MessageManager } from "./dao/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const app = express();
const httpServer = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
const io = new Server(httpServer);
const DB = "mongodb+srv://luchopesce96:chacabuco14@codercluster.r8atrkr.mongodb.net/ecommerce?retryWrites=true&w=majority"

app.engine("handlebars", engine());

app.set("server", httpServer);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.set("io", io);

app.use(express.json());
app.use(express.static(__dirname + "/../src/public"));
app.use(express.urlencoded({extended: true}))
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB,
    }),
    secret: "key",
    saveUninitialized: true,
    resave: true,
  })
);


//routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cookies", cookiesRouter)
app.use("/sessions", sessionsRouter)

mongoose
  .connect(DB)
  .then((conn) => {
    console.log("Connected to DB");
  });

if (config.presistenceType === "db") {
  const messageManager = new MessageManager();
  io.on("connection", (socket) => {
    console.log(`New client connected with id:${socket.id}`);

    socket.on("new-user", async (userName) => {
      const messages = await messageManager.getMessages();
      socket.emit("messages", messages);
      socket.broadcast.emit("new-user", userName);
    });

    socket.on("chat-message", async (data) => {
      const result = await messageManager.createMessage(data);
      result.save().then(async () => {
        const messages = await messageManager.getMessages();
        io.emit("messages", messages);
      });
    });
  });
}
