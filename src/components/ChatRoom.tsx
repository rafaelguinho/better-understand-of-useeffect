import React, { FunctionComponent, useEffect, useState } from "react";

import {
  fetchChannelMessages,
  initiateSocket,
  sendMessage,
  subscribeToMessages,
} from "../helpers/socket";
import { v4 as uuidv4 } from "uuid";

type TMessage = {
  id: string;
  body: string;

  channel: string;
  user: string;
  time: number;
};

type ChatRoomProps = {
  roomId: string;
};

const channel = "general";
const nickname = "guinho";

const ChatRoom: FunctionComponent<ChatRoomProps> = ({
  roomId,
}: ChatRoomProps) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    initiateSocket(channel, nickname);
  }, []);

  useEffect(() => {
    fetchChannelMessages(channel).then((res) => {
      setMessages(res);
    });
  }, []); // ✅ All dependencies declared

  useEffect(() => {
    subscribeToMessages((err: any, data: TMessage) => {
      setMessages((messages) => [...messages, data]);//updater function 
    });
  }, []);

  const handleMessageSend = (e: any) => {
    if (!message) return;

    e.preventDefault();
    const data: TMessage = {
      id: uuidv4(),
      channel,
      user: nickname,
      body: message,
      time: Date.now(),
    };

    //updater function 
    setMessages((messages) => [...messages, data]);

    sendMessage(data);
    setMessage("");
  };

  return (
    <>
      {messages.map((m) => (
        <div key={m.id}>{m.body}</div>
      ))}

      <form onSubmit={handleMessageSend} className="message-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
        />

        <button type="submit">Send</button>
      </form>
    </>
  );
};

export default ChatRoom;
