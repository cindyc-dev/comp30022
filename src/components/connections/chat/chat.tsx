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
import { pusherClient } from "~/utils/pusherClient";
import { AiOutlineClose } from "react-icons/ai";

interface ChatProps {
  connection: ConnectionI | undefined;
  setSelectedConnection: React.Dispatch<
    React.SetStateAction<ConnectionI | undefined>
  >;
  data: ConnectionI[];
  setIsChatMini: React.Dispatch<React.SetStateAction<boolean>>;
}

function Chat({
  connection,
  setSelectedConnection,
  data,
  setIsChatMini,
}: ChatProps) {
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

    // Clear message
    setMessage("");
  };

  // Get user profile from API
  const {
    data: userData,
    isLoading: isProfileLoading,
    error,
  } = api.details.profile.useQuery();
  useEffect(() => {
    if (userData) {
      setUserProfile({
        id: userData.id,
        name: userData.name,
        photoUrl: userData.image,
        email: userData.email,
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
  }, [userData, error]);

  // Get all chat history
  const {
    data: chatHistoryData,
    isLoading: isChatHistoryLoading,
    error: chatHistoryError,
  } = api.chat.getChatMessages.useQuery({ userId: userProfile.id });
  useEffect(() => {
    if (chatHistoryData) {
      const newChatHistory = chatHistoryData
        .map((c) => ({
          ...c,
        }))
        .sort((a, b) => moment(a.createdAt).diff(moment(b.createdAt)));
      console.log({ newChatHistory: newChatHistory });
      setChatHistory([...newChatHistory]);
    }
  }, [chatHistoryData, chatHistoryError]);

  // Subscribe to pusher channel
  useEffect(() => {
    if (!userProfile.id || isConnected) {
      console.log(`No userProfile.id: ${userProfile.id}`);
      return;
    }
    const channel = pusherClient.subscribe(
      // getChannelId(userProfile.id, connection.id)
      userProfile.id
    );

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Subscribed to channel: ", userProfile.id);
      setIsConnected(true);
    });

    // When a new message is received
    channel.bind("chat", (message: ChatI) => {
      console.log({ ReceivedMessage: message });
      // If the message is for and/or from the current connection
      setChatHistory((prev) =>
        [...prev, message].sort((a, b) =>
          moment(a.createdAt).diff(moment(b.createdAt))
        )
      );
    });

    return () => {
      // pusherClient.unsubscribe(getChannelId(userProfile.id, connection.id));
      pusherClient.unsubscribe(userProfile.id);
      pusherClient.disconnect();
      setIsConnected(false);

      console.log("Unsubscribed from channel: ", userProfile.id);
    };
  }, [userProfile]);

  // Scroll to bottom when new message is received or when connection is changed
  useEffect(() => {
    const element = document.getElementById("scroll-to-view");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, connection]);

  return (
    <div className="fixed bottom-2 right-2 rounded-lg border-2 bg-base-100 p-2">
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Chat</div>
            {isConnected ? (
              <div className="badge badge-success">Connected</div>
            ) : (
              <div
                className="badge badge-error cursor-pointer"
                onClick={() => {
                  pusherClient.connect();
                  setIsConnected(true);
                }}
              >
                Disconnected
              </div>
            )}
          </div>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setIsChatMini(true)}
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className="flex justify-center gap-2 pb-2 align-middle">
          {connection?.photoUrl && (
            <label className="avatar h-[2rem] w-[2rem] rounded-full">
              <AvatarImage src={connection?.photoUrl} />
            </label>
          )}
          <select
            value={connection?.id}
            className="select select-bordered select-sm w-full"
            defaultValue="Select Connection"
            onChange={(e) => {
              const selected = data.find((c) => c.id === e.target.value);
              if (selected) {
                setSelectedConnection(selected);
              }
            }}
          >
            <option disabled>Select Connection</option>
            {data.map(
              (c) =>
                c.isExisting && (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                )
            )}
          </select>
        </div>
      </div>
      <div className="h-[40vh] min-h-[10rem] max-w-[50vw]">
        {isChatHistoryLoading ? (
          <div className="loading loading-spinner"></div>
        ) : (
          <div className="flex h-full w-full flex-grow flex-col justify-end">
            {/* Chat History */}
            {!isProfileLoading && (
              <div className="show-scrollbar flex h-full flex-col gap-2 overflow-y-auto">
                {chatHistory.map((m) => {
                  if (
                    (m.senderId === userProfile.id &&
                      m.receiverId === connection?.id) ||
                    (m.senderId === connection?.id &&
                      m.receiverId === userProfile.id)
                  ) {
                    return (
                      <ChatBubble
                        key={m.id}
                        m={m}
                        userId={userProfile.id}
                        photoUrl={
                          m.senderId === userProfile.id
                            ? userProfile.photoUrl
                            : connection.photoUrl
                        }
                      />
                    );
                  } else {
                    return null;
                  }
                })}
                <span id="scroll-to-view"></span>
                {connection &&
                  chatHistory.filter(
                    (m) =>
                      (m.senderId === userProfile.id &&
                        m.receiverId === connection?.id) ||
                      (m.senderId === connection?.id &&
                        m.receiverId === userProfile.id)
                  ).length === 0 && (
                  <div className="text-center">
                      You have not started a conversation with this connection
                      yet. Be the first to say hi! 👋
                  </div>
                )}
                {!connection && (
                  <div className="text-center">
                    Select a connection to start chatting!
                  </div>
                )}
              </div>
            )}
            {isProfileLoading && (
              <span className="loading loading-spinner"></span>
            )}
            {/* Text Input */}
            <div className="flex w-full place-items-end gap-2 py-2">
              <TextInput
                label={""}
                value={message}
                setValue={(v) => setMessage(v)}
                placeholder={"Type a message..."}
                props={{
                  className: `input input-bordered input-sm w-full ${
                    (!connection || !userProfile) && "input-disabled"
                  }`,
                }}
              />
              <button
                className={`btn btn-primary btn-sm ${
                  (!connection || !userProfile) && "btn-disabled"
                }`}
                onClick={() => sendMessage(message)}
              >
                <BsSendFill />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

function ChatBubble({
  m,
  userId,
  photoUrl,
}: {
  m: ChatI;
  userId: string;
  photoUrl?: string;
}) {
  const isMe = m.senderId === userId;
  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"} w-full`}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <AvatarImage src={photoUrl} />
        </div>
      </div>
      <div className="chat-header text-xs">
        <span className="font-semibold">{m.receiverConnection?.name}</span>
        <time className="pl-2 text-xs opacity-50">
          {moment(m.createdAt).clone().format("HH:mm")}
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
