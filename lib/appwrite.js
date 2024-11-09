import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.curx.roplan',
    projectId: '672a278a002cdb956166',
    databaseId: '672a2aa1001a6fd5dbc0',
    userCollectionId: '672a2b06002fd4551bc6',
    storageId: '672a2bce0026df3cbc27'
}
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    storageId,
} = config;

const client = new Client();

client
    .setEndpoint(endpoint) 
    .setProject(projectId) 
    .setPlatform(platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email,password,username) => {
   try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email,password)

        const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
                remember: false
            }                  
        )
        return newUser;
   }
   catch (error){
        console.log(error);
        throw new Error(error);
   }
}
export const signIn = async (email,password) => {
    try {
        const session = await account.createEmailPasswordSession(email,password)
        return session;
    }
    catch(error){
        throw new Error(error);
    }
}
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }
    catch(error){
        throw new Error(error);
    }
}
export const updateUser = async (currentuser,isChecked) => {
    console.log(currentuser)
    try{
        const updateUser = await databases.updateDocument(
            databaseId,
            userCollectionId,
            currentuser.$id,
            {            
                remember : isChecked
            }
        )
    }
    catch(error){
        throw new Error(error)
    }
}   

