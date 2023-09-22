import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";
import { UserI } from "~/types/UserI";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { getUserDetails } from "../Services/UserDetails";

export async function createConnection(senderId: string, receiverId: string) {
  if (senderId == null || receiverId == null || receiverId.length <= 0){
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid User ID",
    });
  };
  if (senderId == receiverId) {
    throw new TRPCError ({
      code: "BAD_REQUEST",
      message: "Cannot form connection with self",
    });
  }

  if (await getUserDetails(receiverId)) {
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
  
    return connection && connection2; 
  }
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
  const connection1 = await prisma.userConnection.deleteMany({
    where: {
      AND: [
        {
          userId_1: senderId,
        },
        {
          userId_2: receiverId,
        },
      ],
    },
  });

  const connection2 = await prisma.userConnection.deleteMany({
    where: {
      AND: [
        {
          userId_1: receiverId,
        },
        {
          userId_2: senderId,
        },
      ],
    },
  });

  return connection1 && connection2;
}

export async function deleteAllExisting() {
  return await prisma.userConnection.deleteMany({})
}