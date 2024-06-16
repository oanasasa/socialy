import { useGetMessages } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import ChatMessagesList from "./ChatMessagesList";
import { createMessage, getMessages } from "@/lib/appwrite/api";
import Loader from "./Loader";
import { Models } from "appwrite";

const ChatModel = () => {
  // const { data: messages, isLoading: isMessageLoading } = useGetMessages();

  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState<Models.Document[] | undefined>([]);

  const data = useGetMessages();

  async function revealMessages() {
    setMessages(data);
  }

  useEffect(() => {
    revealMessages();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    createMessage(messageBody);

    if (messages) {
      // setMessages((prevState) => [data, ...messages]);
    }

    setMessageBody("");
  };

  return (
    <div>
      <div className="chat_container">
        <div className="flex flex-col items-end justify-end h-full">
          <div className="chat_box">
            <ChatMessagesList messages={messages} />
          </div>

          <div className="flex gap-3 mt-5">
            <form>
              <textarea
                required
                maxLength={1000}
                placeholder="Say something..."
                onChange={(e) => setMessageBody(e.target.value)}
                value={messageBody}
                className="chat_input"
              ></textarea>
            </form>
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModel;
