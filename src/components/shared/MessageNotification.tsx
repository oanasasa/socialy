import { useMessageContext } from "@/context/MessageContext";
import { useState } from "react";

const MessageNotification = () => {
  const { messages } = useMessageContext();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredMessages = selectedUserId
    ? messages.filter((message) => message.userId === selectedUserId)
    : messages;
  return (
    <div>
      {/* <h2>Notifications</h2> */}
      <ul>
        {filteredMessages.map((message) => (
          <li key={message.id}>
            User {message.userId}: {message.content} -{" "}
            {message.receivedAt.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageNotification;
