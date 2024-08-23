
import { v4 as uuidv4 } from "uuid";
import ResetToken from "../models/ResetToken";

export async function generateResetToken() {
  return uuidv4();
}

export async function saveResetToken(userId, token) {
  await ResetToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 3600 * 1000),
  });
}
