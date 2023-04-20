import { Router, json } from "express";
import userModel from "../dao/models/user.model.js";

const router = Router();
router.use(json());

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let rol;
    if (!email || !password) {
      return res.status(401).send("SignUp fail!");
    }
    if(email === "adminCoder@coder.com"){
      rol = "admin"
    }
    else{
      rol = "usuario"
    }
    const user = await userModel.findOne({email:email})

    if(!user){
      const newUser = await userModel.create({ email, password, rol});
      req.session.user = newUser.email;
      req.session.rol = newUser.rol
      res.redirect("/perfil")
    }
    else{
      res.send(`Usuario ya registrado <a href="/login">Iniciar sesion</a>`)
    }
  } catch (error) {
    res.status(401).send({ error: error });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send("Login fail!");
  }
  try {
    const newUser = await userModel.find({ email, password });
    req.session.user = newUser[0].email;
    req.session.rol = newUser[0].rol                                                                                                                                                                                                                                                    
    res.redirect("/products")
  } catch (error) {
    res.status(401).send({ error: error });
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    res.redirect("/login")
  });
});

export default router;
