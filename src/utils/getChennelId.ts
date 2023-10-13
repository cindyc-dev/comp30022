export const getChannelId = (userId: string, connectionId: string) => {
  // Channel ID is the userId and connectionId concatenated and sorted
  const channelId = [userId, connectionId].sort().join("").toLowerCase();
  return channelId;
};
