import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";

import { prisma } from "src/server/db";

jest.mock("src/server/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

// Completely Flush prismaMock
beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;