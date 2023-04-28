import { Router, json } from "express";

const router = Router();
router.use(json());
/////////////////////////////////////////////////////////

const thirtyDays = 30 * 24 * 60 * 60 * 1000;

router.post("/set", (req, res) => {
  const user = req.body["client-name"];
  const email = req.body["client-email"];
  res
    .cookie(user, email, {
      maxAge: thirtyDays,
    })
    .redirect("/cookies");
});

router.get("/set", (req, res)=>{
    res.cookie("coder-cookie", "esta es una cookie cooder").send("Cookie creada")
})

router.get("/get", (req, res) => {
  res.send(req.cookies);
});

router.get("/delete", (req, res) => {
  res.clearCookie("coder_cookie").send("Cookie deleted");
});

router.get("/set-signed-cookie", (req, res) => {
  res
    .cookie("signed-cookie", "Esta es una cookie firmada", {
      maxAge: thirtyDays,
      signed: true,
    })
    .send("Cookie firmada con signed");
});

router.get("/get-signed-cookie", (req, res) => {
  res.send(req.signedCookies);
});

/////////////////////////////////////////////////////////

export default router;
