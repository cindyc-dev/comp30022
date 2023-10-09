import { getUserConnections } from "../Repositories/ConnectionRepository";
import { getUserDetails } from "./UserDetails";
import { getCustomConnection } from "../Repositories/CustomContactRepository";
import { ConnectionI } from "~/types/ConnectionI";
import { BEConnectionI } from "~/types/BEConnectionI";

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
        id: user.id,
        name: user.name,
        email: user.email,
        tags: tags,
        notes: userConnections[i]["notes"],
        photoUrl: user.image,
        isExisting: true,
      };
      connectionDetails.push(connection);
    }
  }

  // custom contacts
  const customContacts = await getCustomConnection(userId);

  return [...connectionDetails, ...customContacts!];
}

export async function convertToBEConnection(connection: ConnectionI) {
  const tags = "";
  if (connection.tags.length > 1) {
    connection.tags.forEach(item => {
      tags.concat(item); 
      tags.concat(",");
    });
  }

  const BEConnection: BEConnectionI = {
    name: connection.name,
    email: connection.email,
    phone: connection.phone,
    photoUrl: connection.photoUrl,
    tags: tags,
    notes: connection.notes,
  };

  return BEConnection;
}