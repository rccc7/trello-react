import {Client, Account, ID, Databases, Storage} from 'appwrite'

const client = new Client();
// The project id is stored in the .env.local file and is obtained from the project at appwrite account.
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export {client, account, databases, storage, ID}