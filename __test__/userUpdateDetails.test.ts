import { prismaMock } from "./singleton";
import { setUserDetails } from "~/server/Services/UserDetails";

// Generic User Data for Testing (Future ToDo: Cover more edge cases and malformed inputs)
const alphaNumericPW = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:'\",.<>?/`";
const old_user = {
  id: "@1#",
  name: "test",
  email: "test@gmail.com",
  emailVerified: null,
  password: alphaNumericPW,
  image: "https://i.redd.it/mf030h11if231.jpg",
  contact: "+82 10-9482-0863",
};
const new_name = "Alice";
const new_email = "alice@yahoo.com";
const new_contact = "+61425687495";
const new_user = {
  id: "@1#",
  name: new_name,
  email: new_email,
  emailVerified: null,
  password: alphaNumericPW,
  image: "https://i.redd.it/mf030h11if231.jpg",
  contact: new_contact,
};

test("Should update the name, contact and email fields", async() => {

  prismaMock.user.findUnique.mockResolvedValue(old_user);
  prismaMock.user.update.mockResolvedValue(new_user);
  
  // Test the updatePassword Function
  const successful_update = await setUserDetails(old_user.id, new_name, new_contact, new_email);
  
  expect(successful_update).toBe(true);
  
});

