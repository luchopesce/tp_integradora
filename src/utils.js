import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
