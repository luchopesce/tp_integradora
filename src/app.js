import express from "express";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import cookiesRouter from "./routes/cookies.router.js"
// import sessionsRouter from "./routes/sessions.router.js"
// import session from "express-session";
// import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.router.js"
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import { config } from "./dao/index.js";
import { Server } from "socket.io";
import { MessageManager } from "./dao/index.js";
import passport from "passport";
import { initialzedPassport } from "./config/passport.config.js";
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

const app = express();
dotenv.config()

const MONGODB = process.env.MONGODB
const PORT = process.env.PORT
const httpServer = app.listen(PORT, () => {
  console.log("Server listening on port 8080");
});
const io = new Server(httpServer);
const DB = `${MONGODB}`

app.engine("handlebars", engine());

app.set("server", httpServer);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.set("io", io);
app.use(express.json());
app.use(express.static(__dirname + "/../src/public"));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: DB,
//     }),
//     secret: "key",
//     saveUninitialized: true,
//     resave: true,
//   })
// );
// app.use(passport.session())


//inicializando passport
initialzedPassport()
app.use(passport.initialize())


//routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/cookies", cookiesRouter)
// app.use("/sessions", sessionsRouter)
app.use("/sessions", authRouter)

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
