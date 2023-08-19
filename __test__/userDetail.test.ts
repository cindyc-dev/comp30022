import { getUserEmail } from "src/server/Services/UserDetails.js";
import { createAccount } from "src/server/Services/AuthService";
import { prismaMock } from "./singleton";

test("Should create a new user", async() => {
  const alphaNumericPW = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`";
  const user = {
    id: "",
    name: null,
    email: "test@gmail.com",
    emailVerified: null,
    password: alphaNumericPW,
    image: null,
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(await createAccount(user.email, alphaNumericPW)).toEqual(expect.objectContaining({
    email: "test@gmail.com",
    password: alphaNumericPW,
  }));

});

// test("Should retrieve User Info", async() => {
//   prismaMock.user.findFirst()});
// });