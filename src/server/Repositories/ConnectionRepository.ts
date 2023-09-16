import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { UserI } from "~/types/UserI";

export async function createConnection(senderId: string, receiverId: string) {
  const connection = await prisma.userConnection.create({
    data: {
      userId_1: senderId,
      userId_2: receiverId,
    },
    
  });

  const connection2 = await prisma.userConnection.create({
    data: {
      userId_1: receiverId,
      userId_2: senderId,
    },
  });

  return connection && connection2; //
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


export async function getUserConnections(
  userId: string
){
  const dbResult = await prisma.userConnection.findMany({
    where: {
      userId_1: userId,
    },
    select: {
      userId_2: true,
    }
  });

  if (!dbResult) {
    return null;
  }
  return dbResult;
}


export async function deleteConnection(senderId: string, receiverId: string) {
  const connection = await prisma.userConnection.deleteMany({
    where: {
      AND: [
        {
          userId_1: senderId,
          userId_2: receiverId,
        },
        {
          userId_1: receiverId,
          userId_2: senderId,
        }
      ] 
    },
  });

  return connection;
}