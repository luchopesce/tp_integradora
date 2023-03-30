import { Router, json } from "express";
import { CartManager} from "../dao/index.js";

const router = Router();
router.use(json());
const cartManager = new CartManager();

router.get("/", async (req, res) => {
  const { limit } = req.query;
  const carts = await cartManager.getCarts();
  if (limit > 0) {
    const cartLimit = carts.splice(0, limit);
    res.json(cartLimit);
  } else {
    res.json(carts);
  }
});

router.get("/:cid/", async (req, res) => {
  const cid = req.params.cid;
  try {
    const result = await cartManager.getCartById(cid);
    if (!result) {
      res
        .status(400)
        .send({ status: "error", id: cid, payload: "Cart no exists" });
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

router.post("/", async (req, res) => {
  const { app } = req;
  const result = await cartManager.createCart();
  res.status(201).send({ status: "ok", payload: result });
  cartManager.sendMessage(app);
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { app } = req;
  const prodId = req.params.pid;
  const cartId = req.params.cid;
  try {
    const result = await cartManager.addProductToCart(cartId, prodId);
    if (!result) {
      res
        .status(400)
        .send({
          status: "error",
          idCart: cartId,
          idProduct: prodId,
          payload: "Cart or Product no exists",
        });
    }
    else{
      res.status(201).send({ status: "ok", payload: result });
      cartManager.sendMessage(app);
    }
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const { app } = req;
  const cid = req.params.cid;

  try{
    const result = await cartManager.deleteCart(cid);
    if(!result){
      res.status(400).send({ status: "error", id: cid, payload: "Cart no exists"});
    }
    else{
      res.status(200).send({ status: "ok", payload: result });
      cartManager.sendMessage(app);
    }
  }catch(err){
    res.status(400).send({ status: "error", payload: err.message });
  }
});

export default router;
