import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

export async function createUser(email: string, password: string) {
  const user = await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });

  return user; //
}

const userInfoSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  password: true,
  contact: true,
} satisfies Prisma.UserSelect;

type UserInfoPayload = Prisma.UserGetPayload<{ select: typeof userInfoSelect }>;

export async function getUserWithEmail(
  email: string
): Promise<UserInfoPayload | null> {
  const dbResult = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: userInfoSelect,
  });

  if (!dbResult) {
    return null;
  }
  return dbResult;
}

export async function getUserInfoWithUserId(
  userId: string
): Promise<UserInfoPayload | null> {

  try {
    const dbResult = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userInfoSelect,
    });
  
    if (!dbResult) {
      throw new Error("User does not exist");
    }
  
    // Transform result
    const userInfo: UserInfoPayload = {
      id: userId,
      name: dbResult.name,
      email: dbResult.email,
      image: dbResult.image,
      password: dbResult.password,
      contact: dbResult.contact,
    };
  
    return userInfo;

  } catch (error) {
    console.log("Error Retrieving Info from Database");
    return null;
  }
  
}

export async function UpdateUserPasswordWithId(
  userId: string, newPassword: string
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
    return true;

  } catch (error) {
    return false;
  }

}

export async function updateUserImageWithId(
  userId: string, newImage: string
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: newImage,
      },
    });
    return true;

  } catch (error) {
    return false;
  }

}

export async function updateUserDetailsWithId(
  userId: string, name: string, contact: string, email: string
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        contact: contact,
        email: email,
      },
    });
    return true;

  } catch (error) {
    return false;
  }
}
