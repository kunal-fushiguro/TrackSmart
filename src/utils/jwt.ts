import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";

async function generateToken(userId: string) {
  const newToken = await jwt.sign({ userID: userId }, String(JWT_SECRET));
  return newToken;
}
async function validateToken(token: string) {
  const validateToken = await jwt.verify(token, String(JWT_SECRET));
  return validateToken;
}

export { generateToken, validateToken };
