import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COL_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COL_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COL_ID,
  messagesCollectionId: import.meta.env.VITE_APPWRITE_MESS_COL_ID,
};

export const client = new Client();
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

client.setEndpoint(appwriteConfig.url).setProject(appwriteConfig.projectId);

export default client;
