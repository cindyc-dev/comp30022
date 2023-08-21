import {updateUserImageWithId, getUserInfoWithUserId, updateUserDetailsWithId} from "~/server/Repositories/UserRepository";

interface userDetail {name: string; contact: string; email: string};

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
  const img = user?.image;
  return (img ? img : "");
}

export async function getUserContact(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const contact = user?.contact;
  return (contact ? contact : "");
}

export async function getUserPassword(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const pw = user?.password;
  return (pw ? pw : "");
}

export async function setUserImage(id: string, newImage: string): Promise<boolean> {
  return (updateUserImageWithId(id, newImage));
}

export async function getUserDetails(id: string): Promise<{name: string, contact: string, email: string}> {

  const detail: userDetail = {
    name: await getUserName(id),
    contact: await getUserContact(id),
    email: await getUserEmail(id),
  };

  return detail;
}

export async function setUserDetails(id: string, name: string, contact: string, email: string): Promise<boolean> {
  return (updateUserDetailsWithId(id, name, contact, email));
}




