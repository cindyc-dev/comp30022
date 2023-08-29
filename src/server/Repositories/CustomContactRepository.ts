import { prisma } from "~/server/db";
import { Prisma } from "@prisma/client";

export async function createCustomContact(name?: string, email?: string, password?: string) {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
      },
    });
  }