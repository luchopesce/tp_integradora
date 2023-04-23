import { Router, json } from "express";
import userModel from "../dao/models/user.model.js";
import passport from "passport";
import { generateToken, validateToken } from "../utils.js";

const router = Router();
router.use(json());
let users = [];

router.post(
  "/signup",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/sessions/failure-signup",
  }),
  (req, res) => {
    res.redirect("/perfil");
  }
);

router.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/sessions/failure-login",
  }),
  (req, res) => {
    res.redirect("/perfil");
  }
);

// router.post("/signup-jws", async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = users.find((u) => u.email === email);
//   if (user) {
//     res.json({ message: "El usuario ya esta registrado" });
//   } else {
//     users.push(req.body);
//     const accessToken = generateToken({name, email})
//     res.json({accessToken})
//   }
// });

// router.get("/profile-jws", validateToken, (req, res)=>{
//   const user = req.user
//   console.log(user)
//   res.json({message: "datos del perfil"})
// })

router.get("/failure-signup", (req, res) => {
  res.send(`<div>Error al registrar un usuario, <a href="/registro">Intente de nuevo </a></div>`);
});

router.get("/failure-login", (req, res) => {
  res.send(`<div>Error al ingresar, <a href="/login">Intente de nuevo </a></div>`);
});


router.get("/github", passport.authenticate("signupGithub"));

router.get(
  "/github-callback",
  passport.authenticate("signupGithub", {
    failureRedirect: "/sessions/failure-signup",
  }),
  (req, res) => {
    res.redirect("/perfil")
  }
);

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send("Problemas para cerrar sesion");
    req.session.destroy((err) => {
      if (err) return res.send("No se pudo cerrar sesion");
      else {
        res.redirect("/login");
      }
    });
  });
});

export default router;
