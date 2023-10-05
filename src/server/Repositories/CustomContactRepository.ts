import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

export async function createCustomContact(userId: string, name?: string, email?: string, contact?: string, tags?: string[], notes?: string) {
  await prisma.customContact.create({
    data: {
      name: name,
      email: email,
      contact: contact,
      userId: userId,
      tags: tags,
      notes: notes,
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
): Promise<UserInfoPayload | null> {
  
  if (email == undefined) return null;

  const dbResult = await prisma.user.findFirst({
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

export async function checkCustomExists(
  userId: string, email: string,
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
      ]
    },
  });

  if (!dbResult) {
    return null;
  }
  return true;
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

export async function deleteCustomConnection(userId: string, email?: string) {


  if (email != undefined) {
    const deleted = await prisma.customContact.deleteMany({
      where: {
        userId: userId,
        email: email,
      },
    });
  
    return deleted;
  }
  else {
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
        ]
      },
    });
  
    return deleted;
  }
}