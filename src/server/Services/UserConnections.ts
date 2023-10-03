import { getUserConnections } from "../Repositories/ConnectionRepository";
import { getUserDetails } from "./UserDetails";
import { getCustomConnection } from "../Repositories/CustomContactRepository";




export async function getAllUserConnectionsDetails(userId: string) {
  const connectionDetails = [];
    
  // existing users in the CRM
  const userConnections = await getUserConnections(userId);
  // console.log(userConnections[0]['userId_2']);
  if (userConnections != null) {
    for (let i = 0; i < userConnections.length; i++) {
      console.log(userConnections[i]["userId_2"]);
      const connectionId = userConnections[i]["userId_2"];
      connectionDetails.push(await getUserDetails(connectionId));
    }
  }

  // custom contacts
  const customContacts = await getCustomConnection(userId);

  return [connectionDetails, customContacts];
}