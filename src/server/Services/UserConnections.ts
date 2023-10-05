import { getUserConnections } from "../Repositories/ConnectionRepository";
import { getUserDetails } from "./UserDetails";
import { getCustomConnection } from "../Repositories/CustomContactRepository";
import { ConnectionI } from "~/types/ConnectionI";

export async function getAllUserConnectionsDetails(userId: string) {
  const connectionDetails = [];

  // existing users in the CRM
  const userConnections = await getUserConnections(userId);

  if (userConnections != null) {
    for (let i = 0; i < userConnections.length; i++) {
      const connectionId = userConnections[i]["userId_2"];
      const tags = userConnections[i]["tags"].split(",");
      const user = await getUserDetails(connectionId);


      const connection: ConnectionI = {
        name: user.name,
        email: user.email,
        tags: tags,
        notes: userConnections[i]["notes"],
        isExisting: true,
      };
      connectionDetails.push(connection);
    }
  }

  // custom contacts
  const customContacts = await getCustomConnection(userId);

  return [...connectionDetails, ...customContacts!];
}
