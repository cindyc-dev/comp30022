import { prisma } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { getUserDetails } from "../Services/UserDetails";
import { ConnectionI } from "~/types/ConnectionI";
import { convertToBEConnection } from "../Services/UserConnections";

export async function createConnection(senderId: string, receiverId: string) {
  if (senderId == null || receiverId == null || receiverId.length <= 0){
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid User ID",
    });
  }
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
        tags: "",
        notes: "",
      },
    });
  
    const connection2 = await prisma.userConnection.create({
      data: {
        userId_1: receiverId,
        userId_2: senderId,
        tags: "",
        notes: "",
      },
    });
  
    return connection && connection2; 
  }
  return null;
}


export async function getUserConnections(
  userId: string
){
  const dbResult = await prisma.userConnection.findMany({
    where: {
      userId_1: userId,
    },
    select: {
      userId_2: true,
      tags: true,
      notes: true,
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
      userId_1: senderId,
      userId_2: receiverId,
    },
  });

  const connection2 = await prisma.userConnection.deleteMany({
    where: {
      userId_1: receiverId,
      userId_2: senderId,
    },
  });

  return connection1 && connection2;
}

export async function deleteManyExistingConnections(userID: string, connectionIDs: string[]) {
  const connection1 = await prisma.userConnection.deleteMany({
    where: {
      userId_1: userID,
      userId_2: {
        in: connectionIDs,
      },
    },
  });

  const connection2 = await prisma.userConnection.deleteMany({
    where: {
      userId_1: {
        in: connectionIDs,
      },
      userId_2: userID,
    },
  });

  return connection1 && connection2;
}

export async function searchAllUsers(emailString: string, topX: number) {
  const matches = await prisma.user.findMany({
    where: {
      email: {
        startsWith: emailString,
      }
    },
    take: topX
  });
  
  return matches.map((user) => {
    const connection: ConnectionI = {
      name: user.name || "",
      email: user.email || "",
      phone: user.contact || undefined,
      photoUrl: user.image || undefined,
      tags: [],
    };
    return connection;
  });
}

export async function editExistingContact(userId: string, connectionId: string, connection: ConnectionI) {

  const BEConnection = await convertToBEConnection(connection);

  const update = await prisma.userConnection.update({
    where: {
      userId_1_userId_2: {
        userId_1: userId,
        userId_2: connectionId
      },
    },
    data: {
      tags: BEConnection.tags,
      notes: BEConnection.notes,
    },
  });
  return update;
}