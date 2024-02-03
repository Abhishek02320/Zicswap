import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
//   Property 'env' does not exist on type 'ImportMeta' THIS error show us so we do create (vite-env.d.ts)this file and error get remove  
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
//  ye jo bhi hamne yaha import kiye h (account, avtar) from appwrite website in sabhi me hame (client) ko pass karna hoga mean ye sabhi tab tak work nahi karenge jab tak ham ye nahi baatayenge ki inko kiske reference me work karna h isliye hame yaha (client) pass karna jarruri h wo as reference work karta h   