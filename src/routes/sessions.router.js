import { Router, json } from "express";
import userModel from "../dao/models/user.model.js";
import { createHashB, isValidPassword } from "../utils.js";

const router = Router();
router.use(json());

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let rol;
    if (!email || !password) {
      return res.status(401).send("SignUp fail!");
    }
    if (email === "adminCoder@coder.com") {
      rol = "admin";
    } else {
      rol = "usuario";
    }
    const user = await userModel.findOne({ email: email });

    if (!user) {
      const newUser = {
        email,
        password: createHashB(password),
        rol,
      };
      await userModel.create(newUser);
      req.session.user = newUser.email;
      req.session.rol = newUser.rol;
      res.redirect("/perfil");
    } else {
      res.send(`Usuario ya registrado <a href="/login">Iniciar sesion</a>`);
    }
  } catch (error) {
    res.status(401).send({ error: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Login fail!");
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      if (isValidPassword(user, password)) {
        req.session.user = user.email;
        req.session.rol = user.rol;
        res.redirect("/perfil");
      } else {
        res.send(`Password invalida`);
      }
    } else {
      res.send(
        `El usuario ingresado no existe <a href="/registro">Sign Up</a>`
      );
    }
  } catch (error) {
    res.status(401).send({ error: error });
  }
});

router.post("/forgot", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Forgot fail!");
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      user.password = createHashB(password);
      await userModel.findOneAndUpdate({ email: email }, user);
      res.redirect("/login");
    } else {
      res.send(
        `El usuario ingresado no existe <a href="/registro">Sign Up</a>`
      );
    }
  } catch (error) {
    res.send("No se pudo restablecer la password");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("La sesion no se pudo cerrar");
    res.redirect("/login");
  });
});

export default router;
