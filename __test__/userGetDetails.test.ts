import { getUserContact, getUserDetails, getUserEmail, getUserImage, getUserName, getUserPassword } from "src/server/Services/UserDetails";
import { createAccount } from "src/server/Services/AuthService";
import { prismaMock } from "./singleton";

// Generic User Data for Testing (Future ToDo: Cover more edge cases and malformed inputs)
const alphaNumericPW = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`";
const user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: alphaNumericPW,
  image: "https://i.redd.it/mf030h11if231.jpg",
  contact: "+82 10-9482-0863",
};

test("Should create a new user", async() => {

  // Mock the user creation to insert db
  prismaMock.user.create.mockResolvedValue(user);

  // Call the test function
  const createdUser = await createAccount(user.email, alphaNumericPW);

  expect(createdUser).toMatchObject({
    email: "test@gmail.com",
    password: alphaNumericPW,
  });

});

test("Should retrieve user email", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserEmail(user.id)).toBe(user.email);
});

test("Should retrieve user name", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserName(user.id)).toBe(user.name);
});

test("Should retrieve user image", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserImage(user.id)).toBe(user.image);
});

test("Should retrieve user password", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserPassword(user.id)).toBe(user.password);
});

test("Should retrieve user contact", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserContact(user.id)).toBe(user.contact);
});

test("Should retrieve user details (name, contact, email) object", async () => {
  prismaMock.user.findUnique.mockResolvedValue(user);
  expect(await getUserDetails(user.id)).toMatchObject({
    name: "test",
    contact: "+82 10-9482-0863",
    email: "test@gmail.com",
  });
});