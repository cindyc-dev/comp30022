import PusherClient from "pusher-js";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

PusherClient.logToConsole = true;

export const pusherClient = new PusherClient(
  publicRuntimeConfig.PUSHER_APP_KEY,
  {
    cluster: publicRuntimeConfig.PUSHER_APP_CLUSTER,
  }
);
