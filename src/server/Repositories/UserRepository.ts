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

export async function saveRestoreToken(email: string, token: string): Promise<boolean> {
  const expiry = new Date(); // 1 hour
  expiry.setHours(expiry.getHours() + 1);
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        restoreCode: token,
        restoreExpiry: expiry.toISOString(),
      },
    });
    console.log("Saved to db.");
    return true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error(`User ${email} does not exist!`);
      } else {
        console.log(e);
      }
    }

    return false;
  }
}

export async function getRestoreTokenExpiry(email: string): Promise<Date> {
  try {
    const date = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        restoreExpiry: true,
      }
    });

    if (!date?.restoreExpiry) {
      throw new Error(`No restore token found for ${email}.`);
    }
    return new Date(date.restoreExpiry);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error(`User ${email} does not exist!`);
      }
    }
    throw e;
  }
}

export async function getRestoreToken(email: string): Promise<string> {
  try {
    const dbToken = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        restoreCode: true,
      }
    });

    if (!dbToken?.restoreCode) {
      throw new Error(`No restore token found for ${email}.`);
    }
    return dbToken.restoreCode;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error(`User ${email} does not exist!`);
      }
    }
    throw e;
  }
}

export async function resetToken(email: string) {
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        restoreCode: null,
        restoreExpiry: null,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error(`User ${email} does not exist!`);
      }
    }
    throw e;
  }
}
