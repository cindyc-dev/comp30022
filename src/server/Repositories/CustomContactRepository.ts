import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

export async function createCustomContact(userId: string, name?: string, email?: string, contact?: string) {
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

export async function checkCustomExists(
  email: string, contact: string
): Promise<UserInfoPayload | null> {
  
  if (email == undefined && contact == undefined) return null;

  const dbResult = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        { 
          contact: contact 
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

export async function getCustomConnection(id:string) {
  const dbResult = await prisma.customContact.findMany({
    where: {
      userId: id,
    },
  });

  if (!dbResult) {
    return null;
  }
  return dbResult;
}