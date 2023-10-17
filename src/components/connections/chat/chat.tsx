import React, { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import { NEW_CONNECTION } from "~/sample_data/sampleConnections";
import { ChatI } from "~/types/ChatI";
import { ConnectionI } from "~/types/ConnectionI";
import moment from "moment";
import { api } from "~/utils/api";
import { useToast } from "~/components/hooks/toastContext";
import { getChannelId } from "~/utils/getChennelId";
import { pusherClient } from "~/utils/pusherClient";

function Chat({ connection }: { connection: ConnectionI | undefined }) {
  const [userProfile, setUserProfile] = useState<ConnectionI>(NEW_CONNECTION);
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatI[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { addToast } = useToast();

  // Sending message
  const sendMutation = api.chat.sendChatMessage.useMutation();
  const sendMessage = (message: string) => {
    if (!connection || !userProfile || !message) {
      addToast({
        type: "error",
        message: `Failed to send message. ${!connection && "No connection"} ${
          !userProfile && "No user profile"
        } ${!message && "No message"}`,
      });
      return;
    }
    sendMutation.mutate({
      message: message,
      senderId: userProfile.id,
      senderName: userProfile.name,
      receiverId: connection.id,
      receiverName: connection.name,
    });
  };

  // Get user profile from API
  const {
    data,
    isLoading: isProfileLoading,
    error,
  } = api.details.profile.useQuery();
  useEffect(() => {
    if (data) {
      setUserProfile({
        id: data.id,
        name: data.name,
        photoUrl: data.image,
        email: data.email,
        tags: [],
      });
    }
    if (error) {
      console.error(error);
      addToast({
        type: "error",
        message: `Failed to load user profile. Error: ${error.message}`,
      });
    }
  }, [data, error]);

  // Subscribe to pusher channel
  useEffect(() => {
    if (!userProfile.id || !connection) {
      console.log(`userProfile.id: ${userProfile.id}`);
      console.log(`connection: ${connection}`);
      return;
    }
    const channel = pusherClient.subscribe(
      getChannelId(userProfile.id, connection.id)
    );

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Subscribed to channel successfully.");
      setIsConnected(true);
    });

    channel.bind("chat", (message: ChatI) => {
      console.log("Received message: ", message);
      setChatHistory((prev) => [...prev, message]);
    });

    return () => {
      pusherClient.unsubscribe(getChannelId(userProfile.id, connection.id));

      console.log(
        "Unsubscribed from channel: ",
        getChannelId(userProfile.id, connection.id)
      );
    };
  }, [connection]);

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-end">
      {/* Chat History */}
      {!isProfileLoading && (
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          {chatHistory.map((m) => {
            return <ChatBubble key={m.id} m={m} userId={userProfile.id} />;
          })}
        </div>
      )}
      {isProfileLoading && <span className="loading loading-spinner"></span>}
      {/* Text Input */}
      <div className="flex w-full place-items-end gap-2 py-2">
        <TextInput
          label={""}
          value={message}
          setValue={(v) => setMessage(v)}
          placeholder={"Type a message..."}
          props={{
            className: "input input-bordered input-sm w-full",
          }}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={() => sendMessage(message)}
        >
          <BsSendFill />
        </button>
      </div>
    </div>
  );
}

export default Chat;

function ChatBubble({ m, userId }: { m: ChatI; userId: string }) {
  const isMe = m.senderId === userId;
  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"} w-full`}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <AvatarImage src={m.receiverConnection?.photoUrl} />
        </div>
      </div>
      <div className="chat-header text-xs">
        <span className="font-semibold">{m.receiverConnection?.name}</span>
        <time className="pl-2 text-xs opacity-50">
          {moment(m.time).format("HH:MM")}
        </time>
      </div>
      <div className={`chat-bubble text-sm ${isMe && "chat-bubble-secondary"}`}>
        {m.message}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "Chat",
    },
  };
}
