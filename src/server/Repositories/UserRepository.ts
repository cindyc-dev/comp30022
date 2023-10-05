import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { UserI } from "~/types/UserI";

export async function createUser(
  email: string,
  password: string,
  name: string
) {
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });

  console.log(user);

  return user;
}

const userInfoSelect = {
  id: true,
  name: true,
  email: true,
  contact: true,
  image: true,
  password: true,
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
      throw new Error("User does not exist.");
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
    throw new Error(`Error retrieving user info. Error: ${error}`);
  }
}

export async function UpdateUserPasswordWithId(
  userId: string,
  newPassword: string
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
    throw new Error(`Error updating user password. Error: ${error}`);
  }
}

export async function updateUserImageWithId(
  userId: string,
  newImage: string
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
    throw new Error(`Error updating user image. Error: ${error}`);
  }
}

export async function updateUserDetailsWithId(user: UserI): Promise<boolean> {
  try {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        contact: user.contact,
        email: user.email,
      },
    });
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === "P2002") {
        throw new Error(
          `Error updating user details. This email is already used on a different account. Error: ${e}`
        );
      }
    }
    throw new Error(`Error updating user details. Error: ${e}`);
  }
}
