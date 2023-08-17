import bcrypt from "bcrypt";
import {createUser, getUserWithEmail} from "~/server/Repositories/UserRepository";

const SALT_ROUNDS = 10;

export async function createAccount(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await createUser(email, hashedPassword);
}

export async function accountExists(email: string): Promise<boolean> {
  const user = await getUserWithEmail(email);
  return user !== null;
}

export async function checkPassword(email: string, password:string) {

  const user = await getUserWithEmail(email);

  if (user === null) {
    return false;
  }

  const userPassword = user.password;
  const match = await bcrypt.compare(password, userPassword);

  return match;
}