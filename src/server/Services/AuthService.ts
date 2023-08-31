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
  return await createUser(email, hashedPassword); //
}

export async function accountExists(email: string): Promise<boolean> {
  const user = await getUserWithEmail(email);
  return user !== null;
}

export async function checkPassword(email: string, password:string) {
  const user = await getUserWithEmail(email);
  if (user === null || user.password == null) {
    return false;
  }
  const userPassword = user.password;
  const match = await bcrypt.compare(password, userPassword);

  return match;
}


// main function for checking & updating user password
export async function updatePassword(id: string, currPassword: string, newPassword: string): Promise<boolean> {
  const dbPassword = await getUserPassword(id);
  const passwordMatch = await bcrypt.compare(currPassword, dbPassword);

  if (passwordMatch) {
    // Correct Password
    const hashedNewPassword = await hashText(newPassword);
    if (await UpdateUserPasswordWithId(id, hashedNewPassword)) {
      // Successful Update
      return true;
    }
  }
  return false;
}

