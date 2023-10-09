import {
  updateUserImageWithId,
  getUserInfoWithUserId,
  updateUserDetailsWithId,
} from "~/server/Repositories/UserRepository";
import { UserI } from "~/types/UserI";

export async function getUserName(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const name = user?.name;
  return name ? name : "";
}

export async function getUserEmail(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const email = user?.email;
  return email ? email : "";
}

export async function getUserImage(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const img = user?.image;
  return img ? img : "";
}

export async function getUserContact(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const contact = user?.contact;
  return contact ? contact : "";
}

export async function getUserPassword(id: string): Promise<string> {
  const user = await getUserInfoWithUserId(id);
  const pw = user?.password;
  return pw ? pw : "";
}

// main function for setting user image
export async function setUserImage(
  id: string,
  newImage: string
): Promise<boolean> {
  return updateUserImageWithId(id, newImage);
}

// main function for retrieving user details object
export async function getUserDetails(id: string): Promise<UserI> {
  const user = await getUserInfoWithUserId(id);
  if (!user) {
    throw new Error("User not found");
  }
  const detail: UserI = {
    id: user.id,
    name: user.name || "",
    contact: user.contact || "",
    email: user.email || "",
    image: user.image || "",
  };

  return detail;
}

// main function for setting user details
export async function setUserDetails(user: UserI): Promise<boolean> {
  return updateUserDetailsWithId(user);
}
