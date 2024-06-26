// MessageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

interface Message {
  id: string;
  userId: number;
  content: string;
  receivedAt: Date;
}

interface UserNotification {
  userId: number;
  count: number;
}

interface MessageContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  notifications: UserNotification[];
  clearNotifications: (userId: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  console.log(messages);
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setNotifications((prevNotifications) => {
      const userNotification = prevNotifications.find(
        (n) => n.userId === message.userId
      );
      if (userNotification) {
        return prevNotifications.map((n) =>
          n.userId === message.userId ? { ...n, count: n.count + 1 } : n
        );
      } else {
        return [...prevNotifications, { userId: message.userId, count: 1 }];
      }
    });
  };

  const clearNotifications = (userId: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.userId === userId ? { ...n, count: 0 } : n
      )
    );
  };

  return (
    <MessageContext.Provider
      value={{ messages, addMessage, notifications, clearNotifications }}
    >
      {children}
    </MessageContext.Provider>
  );
};
