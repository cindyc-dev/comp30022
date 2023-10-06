import bcrypt from "bcrypt";
import {
  UpdateUserPasswordWithId,
  createUser,
  getUserWithEmail,
  saveRestoreToken, getRestoreTokenExpiry, getRestoreToken, resetToken
} from "~/server/Repositories/UserRepository";
import { getUserPassword } from "./UserDetails";
import {TRPCError} from "@trpc/server";

const SALT_ROUNDS = 10;
export const RESTORE_TOKEN_LENGTH = 6;

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

export async function restorePassword(email: string, token: string, password: string): Promise<boolean> {
  const tokenExpiry = await getRestoreTokenExpiry(email);
  const now = new Date();

  if (now > tokenExpiry) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token has expired",
    });
  }

  const dbToken = await getRestoreToken(email);
  if (!(await bcrypt.compare(token, dbToken))) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }

  const hashedNewPassword = await hashText(password);
  const user = await getUserWithEmail(email);

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found.",
    });
  }

  await UpdateUserPasswordWithId(user.id, hashedNewPassword);
  await resetToken(email);

  return true;
}

export async function generateRestoreToken(email: string): Promise<boolean> {
  const token = makeToken(RESTORE_TOKEN_LENGTH);

  console.log(`Restore token ${token} generated for ${email}.`);
  // Send token to email

  const hashedToken = await hashText(token);

  return (await saveRestoreToken(email, hashedToken));
}

export async function hashText(Text: string): Promise<string> {
  const hashedText = await bcrypt.hash(Text, SALT_ROUNDS);
  return hashedText;
}

function makeToken(length: number): string {
  const characters = "0123456789";
  let result = "";
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }

  return result;
}

