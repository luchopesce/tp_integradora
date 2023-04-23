import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SECRET_KEY = "tokenSecretKey";

export default __dirname;

export async function getNextId(arr) {
  if (arr.length === 0) {
    return 0;
  }

  const higthId = arr.reduce((acc, curr) => {
    return curr.id > acc ? curr.id : acc;
  }, 0);

  return higthId + 1;
}

export function createHashB(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export function isValidPassword(user, logPassword) {
  return bcrypt.compareSync(logPassword, user.password);
}

export function generateToken(user) {
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: "60s",
  });
  return token;
}

export function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).send({ message: "Error de authorization" });
  const token = authHeader.split(" ")[1];
  // console.log(token)
  jwt.verify(token, SECRET_KEY, (err, info) => {
    if (err) return res.status(401).send({ message: "Error de datos" });
    req.user = info;
    next();
  });
}
