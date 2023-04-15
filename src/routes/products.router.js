import { Router, json } from "express";
import { ProductManager } from "../dao/index.js";

const router = Router();
router.use(json());
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  const { limit, page, sort, title, stock } = req.query;

  let options = {
    lean: true,
    limit: limit ?? 10,
    page: page ?? 1,
    sort: { price: sort },
  };
  let query = {};
  if (title) {
    query.title = { $regex: new RegExp(title) };
  }
  if (stock) {
    query.stock = Number(stock);
  }

  try {
    const paginate = await productManager.paginateProducts(query, options);
    res.status(200).send({ status: "ok", payload: paginate  });
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

router.get("/:pid/", async (req, res) => {
  const pid = req.params.pid;
  try {
    const result = await productManager.getProductById(pid);
    if (!result) {
      res
        .status(400)
        .send({ status: "error", id: pid, payload: "Product no exists" });
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

router.post("/", async (req, res) => {
  const products = await productManager.getProducts();
  const { app } = req;
  const { title, description, code, price, stock, category, thumbnail } =
    req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !stock ||
    !category ||
    !thumbnail
  ) {
    res.status(400).send({ status: "error", payload: "Missing parameters" });
  }

  if (products.some((product) => product.code === code)) {
    res.status(400).send({
      status: "error",
      code: code,
      payload: "Code existing, change this code",
    });
  } else {
    const result = await productManager.createProduct({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail: [],
    });

    if (!result) {
      return res
        .status(404)
        .send({ status: "error", payload: "Check paramaters" });
    }

    res.status(201).send({ status: "ok", payload: result });
    productManager.sendMessage(app);
  }
});

router.put("/:pid", async (req, res) => {
  const { app } = req;
  const { pid } = req.params;
  const obj = req.body;

  if (Object.entries(obj).length < 1) {
    return res
      .status(400)
      .send({ status: "error", payload: "Missing parameters" });
  }

  try {
    const result = await productManager.updateProduct(pid, obj);
    if (!result) {
      res
        .status(400)
        .send({ status: "error", id: pid, payload: "Product no exists" });
    } else {
      res.status(200).send({ status: "ok", payload: result });
      productManager.sendMessage(app);
    }
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

router.delete("/:pid", async (req, res) => {
  const { app } = req;
  const pid = req.params.pid;

  try {
    const result = await productManager.deleteProduct(pid);
    if (!result) {
      res
        .status(400)
        .send({ status: "error", id: pid, payload: "Product no exists" });
    } else {
      res.status(200).send({ status: "ok", payload: result });
      productManager.sendMessage(app);
    }
  } catch (err) {
    res.status(400).send({ status: "error", payload: err.message });
  }
});

export default router;
