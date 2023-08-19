import bcrypt from "bcrypt";
import {UpdateUserPasswordWithId, createUser, getUserWithEmail} from "~/server/Repositories/UserRepository";
import { getUserPassword } from "./UserDetails";

const SALT_ROUNDS = 10;

export async function hashText(Text: string): Promise<string> {
  const hashedText = await bcrypt.hash(Text, SALT_ROUNDS);
  return hashedText;
}

export async function createAccount(email: string, password: string) {
  const hashedPassword = await hashText(password);
  await createUser(email, hashedPassword);
}

export async function accountExists(email: string): Promise<boolean> {
  const user = await getUserWithEmail(email);
  return user !== null;
}

export async function comparePassword(id: string, currPassword: string): Promise<boolean> {
  const dbPassword = await getUserPassword(id);
  const hashedCurrPassword = await hashText(currPassword);
  return (dbPassword == hashedCurrPassword);
}

export async function updatePassword(id: string, currPassword: string, newPassword: string): Promise<boolean> {
  if (await comparePassword(id, currPassword)) {
    // Correct Password
    const hashedNewPassword = await hashText(newPassword);
    if (await UpdateUserPasswordWithId(id, hashedNewPassword)) {
      // Successful Update
      return true;
    }
  }
  return false;
}