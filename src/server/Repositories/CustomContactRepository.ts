import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { ConnectionI } from "~/types/ConnectionI";

export async function createCustomContact(
  userId: string,
  name?: string,
  email?: string,
  contact?: string
) {
  await prisma.customContact.create({
    data: {
      name: name,
      email: email,
      contact: contact,
      userId: userId,
    },
  });
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

export async function checkExistingUserExists(
  email: string,
  contact: string
): Promise<UserInfoPayload | null> {
  if (email == undefined && contact == undefined) return null;

  const dbResult = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          contact: contact,
        },
      ],
    },
    select: userInfoSelect,
  });

  if (!dbResult) {
    return null;
  }
  return dbResult;
}

export async function checkCustomExists(
  userId: string,
  email: string
): Promise<boolean | null> {
  if (email == undefined) return null;

  const dbResult = await prisma.customContact.findFirst({
    where: {
      AND: [
        {
          userId: userId,
        },
        {
          email: email,
        },
      ],
    },
  });

  if (!dbResult) {
    return null;
  }
  return true;
}

export async function getCustomConnection(id: string): Promise<ConnectionI[]> {
  const dbResult = await prisma.customContact.findMany({
    where: {
      userId: id,
    },
  });

  if (!dbResult) {
    throw new Error("User does not exist.");
  }
  return dbResult.map((user) => {
    const connection: ConnectionI = {
      name: user.name || "",
      email: user.email || "",
      phone: user.contact || undefined,
      photoUrl: user.image || undefined,
      tags: [],
    };
  });
}

export async function deleteCustomConnection(
  userId: string,
  email?: string,
  contact?: string
) {
  if (email != undefined && contact != undefined) {
    const deleted = await prisma.customContact.deleteMany({
      where: {
        userId: userId,

        AND: [
          {
            email: email,
          },
          {
            contact: contact,
          },
        ],
      },
    });

    return deleted;
  } else {
    const deleted = await prisma.customContact.deleteMany({
      where: {
        userId: userId,

        OR: [
          {
            email: email,
          },
          {
            contact: contact,
          },
        ],
      },
    });

    return deleted;
  }
}
