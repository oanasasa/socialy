import { useEffect, useState } from "react";
import {
  ID,
  Models,
  Permission,
  Query,
  RealtimeResponseEvent,
  Role,
} from "appwrite";
import { client, appwriteConfig, databases } from "@/lib/appwrite/config";
import Loader from "@/components/shared/Loader";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import { useMessageContext } from "@/context/MessageContext";

//2. pus notificare cand primesti mesaj pe user-ul care a scris

const Messenger = () => {
  const [messages, setMessages] = useState<Models.Document[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const chat_container = document.getElementById(
    "chatBox"
  ) as HTMLElement | null;
  const { id } = useParams();
  const { data: currentUser } = useGetCurrentUser();
  const { data: paramUser } = useGetUserById(id || "");
  const { addMessage } = useMessageContext();

  useEffect(() => {
    if (currentUser?.accountId && paramUser?.$id) {
      getMessages();
    }
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
          setMessages((prevState) => [...prevState, response.payload]);

          const message = {
            id: ID.unique(),
            userId: response.payload.sender_id,
            content: response.payload.body,
            receivedAt: new Date(),
          };
          addMessage(message);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

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
        [
          Query.orderAsc("$createdAt"),
          Query.or([
            Query.and([
              Query.equal("sender_id", currentUser?.accountId),
              Query.equal("receiver_id", paramUser?.accountId),
            ]),
            Query.and([
              Query.equal("sender_id", paramUser?.accountId),
              Query.equal("receiver_id", currentUser?.accountId),
            ]),
          ]),
        ]
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
        sender_id: currentUser?.accountId,
        receiver_id: paramUser?.accountId,
        username: currentUser?.name,
        body: messageBody,
      };

      if (currentUser?.accountId) {
        let permissions = [Permission.write(Role.user(currentUser.accountId))];

        let response = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.messagesCollectionId,
          ID.unique(),
          payload,
          permissions
        );

        console.log("Response:", response);
      }

      setMessageBody("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const deleteMessage = async function (message_id: string) {
    databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.messagesCollectionId,
      message_id
    );
  };
  function formatNiceDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formattedDate = date.toLocaleString("ro-RO", options);

    return formattedDate;
  }
  return (
    <div className="w-full">
      <div className="chat_container">
        <div className="flex flex-col items-end justify-end h-full">
          <div id="chatBox" className="chat_box">
            {!messages ? (
              <Loader />
            ) : (
              <ul>
                {messages?.map((message: Models.Document) => (
                  <li
                    key={message.$id}
                    className={`chat_message ${
                      message.sender_id === currentUser?.accountId
                        ? "owner"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p>
                        {message?.username ? (
                          <span>{message?.username}</span>
                        ) : (
                          "Anonymous user"
                        )}
                        <span className="chat_date">
                          ({formatNiceDate(message.$createdAt)})
                        </span>
                      </p>

                      {message.$permissions.includes(
                        `delete(\"user:${currentUser?.accountId}\")`
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
                    <div className="message_body">
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
                onKeyDown={handleKeyDown}
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
