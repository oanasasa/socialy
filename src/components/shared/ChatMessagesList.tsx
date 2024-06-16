import { Models } from "appwrite";

type ChatMessagesListProps = {
  messages?: Models.Document[];
};

const ChatMessagesList = ({ messages }: ChatMessagesListProps) => {
  return (
    <div className="w-full">
      <ul>
        {/* {messages?.map((message, index) => (
          <li key={index} className="chat_message">
            <p>{message.body}</p>
            <p>{message.$createdAt}</p>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default ChatMessagesList;
