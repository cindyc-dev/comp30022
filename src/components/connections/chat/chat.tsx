import React, { useState } from "react";
import { BsSendFill } from "react-icons/bs";
import AvatarImage from "~/components/common/avatarImage";
import TextInput from "~/components/common/textInput";
import Layout from "~/components/layout/layout";
import { DEFAULT_PROFILE_PIC } from "~/sample_data/sampleConnections";
import { sampleChatHistory } from "~/sample_data/sampleChat";
import { ChatI } from "~/types/ChatI";
import { ConnectionI } from "~/types/ConnectionI";
import moment from "moment";

function Chat() {
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatI[]>(sampleChatHistory);

  // TODO API call to get the user's name
  const userConnection: ConnectionI = {
    name: "Test User",
    photoUrl: DEFAULT_PROFILE_PIC,
    id: "",
    email: "",
    tags: [],
  };

  return (
    <div className="flex h-full w-full flex-grow flex-col justify-end">
      {/* Chat History */}
      <div className="flex h-full flex-col gap-2 overflow-y-auto">
        {chatHistory.map((m) => {
          if (m.isMe) {
            m.connection = userConnection;
          }
          return <ChatBubble key={m.id} m={m} />;
        })}
      </div>
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
        <button className="btn btn-primary btn-sm">
          <BsSendFill />
        </button>
      </div>
    </div>
  );
}

export default Chat;

function ChatBubble({ m }: { m: ChatI }) {
  return (
    <div className={`chat ${m.isMe ? "chat-end" : "chat-start"} w-full`}>
      <div className="avatar chat-image">
        <div className="w-10 rounded-full">
          <AvatarImage src={m.connection?.photoUrl} />
        </div>
      </div>
      <div className="chat-header text-xs">
        <span className="font-semibold">{m.connection?.name}</span>
        <time className="pl-2 text-xs opacity-50">
          {moment(m.time).format("HH:MM")}
        </time>
      </div>
      <div
        className={`chat-bubble text-sm ${!m.isMe && "chat-bubble-secondary"}`}
      >
        {m.message}
      </div>
    </div>
  );
}
