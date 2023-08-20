import {hashText, updatePassword } from "src/server/Services/AuthService";
import { prismaMock } from "./singleton";
import bcrypt from "bcrypt";
import { UpdateUserPasswordWithId } from "~/server/Repositories/UserRepository";

// Generic User Data for Testing (Future ToDo: Cover more edge cases and malformed inputs)
const old_alphaNumericPW = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`";
const new_alphaNumericPW = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`ABCDEFGHIJKLMNOPQRSTUVWXYZ;";
const hashedOld_alphaNumericPW = bcrypt.hashSync(old_alphaNumericPW, 10);

// hashedOld_alphaNumericPW
//   .then((result) => {
//     console.log(result);
//   })
//   .catch(((err) => {
//     console.log(err);
//   }));

const old_user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: hashedOld_alphaNumericPW,
  image: "https://i.redd.it/mf030h11if231.jpg",
};
const new_user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: new_alphaNumericPW,
  image: "https://i.redd.it/mf030h11if231.jpg",
};

test("Should update user password", async() => {
  prismaMock.user.update.mockResolvedValue(new_user);
  expect(await UpdateUserPasswordWithId(old_user.id, new_alphaNumericPW)).toBe(true);
});

test("Should alter original password to new password", async() => {

  // For the getUserPassword function
  prismaMock.user.findUnique.mockResolvedValue(old_user);
  prismaMock.user.update.mockResolvedValue(new_user);

  // Test the updatePassword Function
  const successful_update = await updatePassword(old_user.id, old_alphaNumericPW, new_alphaNumericPW);

  expect(successful_update).toBe(true);

});

