import {getUserInfoWithUserId} from "~/server/Repositories/UserRepository";

export async function getUserName(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const name = user?.name;
  return (name ? name : "");
}

export async function getUserEmail(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const email = user?.email;
  return (email ? email : "");
}

export async function getUserImage(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const img = user?.name;
  return (img ? img : "");
}

export async function getUserPassword(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const pw = user?.password;
  return (pw ? pw : "");
}


