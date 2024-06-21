import { useEffect, useState } from "react";
import {
  ID,
  Models,
  Permission,
  Query,
  RealtimeResponseEvent,
  Role,
} from "appwrite";
import client, { appwriteConfig, databases } from "@/lib/appwrite/config";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";

const Messenger = () => {
  const [messages, setMessages] = useState<Models.Document[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const chat_container = document.getElementById(
    "chatBox"
  ) as HTMLElement | null;
  const { user } = useUserContext();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      [
        `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      ],
      (response: RealtimeResponseEvent<Models.Document>) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          // console.log("A message was created");
          setMessages((prevState) => [...prevState, response.payload]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          // console.log("A message was deleted!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (chat_container) {
      chat_container.scrollTop = chat_container.scrollHeight;
    }
  }, [messages]);

  //Get the messages
  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.messagesCollectionId,
        [Query.orderAsc("$createdAt"), Query.limit(20)]
      );
      setMessages(response.documents);
    } catch (error) {
      console.log(error);
    }
  };

  //Handle submitting the messages
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let payload = {
        user_id: user?.id,
        username: user?.name,
        body: messageBody,
      };

      if (user.id) {
        let permissions = [Permission.write(Role.user(user.id))];

        console.log(permissions);

        let response = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messagesCollectionId,
          ID.unique(),
          payload,
          permissions
        );

        console.log("RESPONSE:", response);
      }

      setMessageBody("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMessage = async function (message_id: string) {
    databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      message_id
    );

    // setMessages((prevState) =>
    //   messages.filter((message) => message.$id !== message_id)
    // );
  };

  function formatNiceDate(dateString: string): string {
    // Create a new Date object from the input date string
    const date = new Date(dateString);

    // Define options for formatting the date without seconds
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    // Format the date and time
    const formattedDate = date.toLocaleString("ro-RO", options);

    return formattedDate;
  }
  // console.log(messages);

  return (
    <div className="w-full">
      <div className="chat_container">
        <div className="flex flex-col items-end justify-end h-full">
          <div id="chatBox" className="chat_box">
            {!messages ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-9 flex-1 w-full">
                {messages?.map((message: Models.Document) => (
                  <li key={message.$id} className="chat_message">
                    <div className="flex items-center justify-between gap-3">
                      <p>
                        {message?.username ? (
                          <span>{message?.username}</span>
                        ) : (
                          "Anonymous user"
                        )}
                        <span className="chat_date">
                          {formatNiceDate(message.$createdAt)}
                        </span>
                      </p>

                      {message.$permissions.includes(
                        `delete(\"user:${user.id}\")`
                      ) && (
                        <button
                          onClick={() => {
                            deleteMessage(message.$id);
                          }}
                        >
                          <img
                            src="/assets/icons/delete.svg"
                            alt="delete message"
                            width={15}
                            height={15}
                          />
                        </button>
                      )}
                    </div>
                    <div
                      className={
                        "message_body" +
                        (message.user_id === user.id
                          ? "message_body_owner"
                          : "")
                      }
                    >
                      <span>{message?.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-full">
            <form className="flex gap-3 mt-5" onSubmit={handleSubmit}>
              <textarea
                required
                maxLength={1000}
                placeholder="Say something..."
                onChange={(e) => setMessageBody(e.target.value)}
                value={messageBody}
                className="chat_input"
              ></textarea>
              <input type="submit" value="Send" className="btn" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
