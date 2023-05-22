import { Router, json } from "express";
import passport from "passport";
import { generateToken } from "../utils.js";

const router = Router();
router.use(json());


router.post(
  "/login",
  passport.authenticate("loginStrategy", {
    failureRedirect: "/sessions/failure",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const accessToken = generateToken({
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    });
    res
      .cookie("token-cookie", accessToken, { httpOnly: true })
      .redirect("/perfil");
  }
);


router.post(
  "/signup",
  passport.authenticate("signupStrategy", {
    failureRedirect: "/sessions/failure",
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const accessToken = generateToken({
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    });
    res
      .cookie("token-cookie", accessToken, { httpOnly: true })
      .redirect("/perfil");
  }
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("token-cookie").json({status:"sucess", message: "session finalizada"})
  });
});


// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await userModel.findOne({ email: email });
//     if (user) {
//       if (isValidPassword(password, user)) {
//         const accessToken = generateToken({
//           first_name: user.first_name,
//           email: user.email,
//           role: user.role,
//         });
//         res
//           .cookie("token-cookie", accessToken, { httpOnly: true })
//           .redirect("/products");
//       } else {
//         res.send(
//           `<div>Credenciales invalidas, <a href="/login">Intente de nuevo </a></div>`
//         );
//       }
//     } else {
//       res.send(
//         `<div>El usuario ingresado no existe, <a href="/signup">Para continuar debe registrarse </a></div>`
//       );
//     }
//   } catch (error) {
//     res.json({ status: "error", message: error.message });
//   }
// });

// router.post("/signup", async (req, res) => {
//   const { first_name, last_name, email, password } = req.body;

//   try {
//     const user = await userModel.findOne({ email: email });
//     if (!user) {
//       const newUser = {
//         first_name,
//         last_name,
//         email,
//         password: createHashB(password),
//       };
//     } else {
//       res.send(
//         `<div>Usuario ya registrado, <a href="/login">Loguearse</a></div>`
//       );
//     }
//   } catch (error) {
//     res.json({ status: "error", message: error.message });
//   }
// });

// router.get("/profile-jws", validateToken, (req, res) => {
//   const user = req.user;
//   console.log(user);
//   res.json({ message: "datos del perfil" });
// });

// router.get(
//   "/profile-jws-passport",
//   authenticate("jwt"),
//   authorize("admin"),
//   (req, res) => {
//     console.log(req.user);
//     res.status(200).json({ message: "datos del perfil" });
//   }
// );

// router.post("/signup-jws", async (req, res) => {
//   const { name, email, password } = req.body;
//   const user = users.find((u) => u.email === email);
//   if (user) {
//     res.json({ message: "El usuario ya esta registrado" });
//   } else {
//     users.push(req.body);
//     const accessToken = generateToken({ name, email });
//     res.json({ accessToken });
//   }
// });

// router.post(
//   "/login",
//   passport.authenticate("loginStrategy", {
//     failureRedirect: "/sessions/failure-login",
//   }),
//   (req, res) => {
//     res.redirect("/perfil");
//   }
// );

// router.get("/failure-signup", (req, res) => {
//   res.status(400).json("Datos invalidos");
// });

// router.get("/failure-login", (req, res) => {
//   res.send(`<div>Error al ingresar, <a href="/login">Intente de nuevo </a></div>`);
// });

// router.get("/github", passport.authenticate("signupGithub"));

// router.get(
//   "/github-callback",
//   passport.authenticate("signupGithub", {
//     failureRedirect: "/sessions/failure-signup",
//   }),
//   (req, res) => {
//     res.redirect("/perfil")
//   }
// );


export default router;
