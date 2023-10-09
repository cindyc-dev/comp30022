import { prismaMock } from "./singleton";
import { setUserImage } from "~/server/Services/UserDetails";

// Generic User Data for Testing (Future ToDo: Cover more edge cases and malformed inputs)
const alphaNumericPW = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`";
const old_image = "https://i.redd.it/mf030h11if231.jpg";
const new_image = "https://live-production.wcms.abc-cdn.net.au/6e325bba5eb75d5ebb51e2caedb41811.jpg?src"; 
const old_user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: alphaNumericPW,
  image: old_image,
  contact: "+82 10-9482-0863",
  restoreCode: "000000",
  restoreExpiry: new Date("2023-01-01"),
};
const new_user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: alphaNumericPW,
  image: new_image,
  contact: "+82 10-9482-0863",
  restoreCode: "000000",
  restoreExpiry: new Date("2023-01-01"),
};

test("Should update user image", async() => {
  
  prismaMock.user.findUnique.mockResolvedValue(old_user);
  prismaMock.user.update.mockResolvedValue(new_user);

  expect(await setUserImage(old_user.id, new_image)).toBe(true);
});