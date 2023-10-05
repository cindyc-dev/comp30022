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
      connectionDetails.push(await getUserDetails(connectionId));
    }
  }

  // Convert UserIs to ConnectionIs
  const convertedUsers = connectionDetails.map((user) => {
    const connection: ConnectionI = {
      name: user.name,
      email: user.email,
      tags: [],
    };
    return connection;
  });

  // custom contacts
  const customContacts = await getCustomConnection(userId);

  return [...convertedUsers, ...customContacts!];
}
