import { getUserEmail } from "./UserDetails";

const test_id = "cllhjbxsi0000uk6g3opkfwjf";

async function testGetUserEmail() {
    const email = await getUserEmail(test_id);
    console.log(email);
}

testGetUserEmail();




/* Notable changes to test

UserRepository.ts
- getUserInfoWithUserId
- UpdateUserPasswordWithId

AuthService.ts (MAIN)
- hashText
- comparePassword
- updatePassword

UserDetails.ts (MAIN)
- getUserName
- getUserEmail
- getUserImage
- getUserPassword
TODO
- setters


*/