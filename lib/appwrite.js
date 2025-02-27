import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.curx.roplan',
    projectId: '672a278a002cdb956166',
    databaseId: '672a2aa1001a6fd5dbc0',
    userCollectionId: '672a2b06002fd4551bc6',
    storageId: '672a2bce0026df3cbc27',
    profileDatabaseId : '6734e6de0035bcf7936d',
    datesCollectionId: '6742cfd90023b95211d2',
    tasksCollectionId: '67449daf002472e83838',
    accessoriesCollectionId: '675570e9003de660489b',
    profileAccessoriesCollectionId: '676c081700062c7c6b49',
}
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    storageId,
    profileDatabaseId,
    datesCollectionId,
    tasksCollectionId,
    accessoriesCollectionId,
    profileAccessoriesCollectionId,
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

        const avatarUrl = avatars.getInitials(username);

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
        throw new Error(error);
   }
}
export const SearchUser = async (username) => {
    try {
        const searchUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('username', username)]
        )
        return searchUser;
    }
    catch (error){
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
export const signOut = async (email,password) => {
    
}
export const createProfile = async (user,id) => {
    try {
        const newProfile =  databases.createDocument(
            databaseId,
            profileDatabaseId,
            ID.unique(),
            {   
                users : id,
                coin : 0,
                XP : 0,
                level : 1,
                HP : 50,
                diamond : 5,
                strength: 0,
                intelligence: 0,
                agility: 0,
                tasks : ["Brush teeth", "Cold shower", "Reading", "Programming","Meditating"],
            }
        )
        return newProfile;
    }
    catch(error){
        throw new Error();
    }
};
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
export const getCurrentProfile = async () => {
    try {
        const currentAccount = await getCurrentUser();

        if(!currentAccount) throw Error;
        const currentProfile = await databases.listDocuments(
            databaseId,
            profileDatabaseId,
            [Query.equal('users',currentAccount.$id)]
        )
        if(!currentProfile) throw Error;
        return currentProfile.documents[0];
    }
    catch(error){
        throw new Error(error);
    }
}
export const useAppwrite = (fn) => {
    const [data, setData] = useState([])
    const [isloading, setisLoading] = useState(true)
  
    const fetchData = async () => {
        setisLoading(true);
        try{
            const response = await fn();
            
            setData(response);
        }
        catch(error){
            Alert.alert('Error', error.message)
        }
        finally {
            setisLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    const refetch = () => fetchData();
    return {data, isloading,refetch}
   
}
export const updateUser = async (currentuser,isChecked) => {
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
export const updateStats = async(currentProfile,coin,xp) => {
    try {
        const updateTasksleft = databases.updateDocument(
            databaseId,
            profileDatabaseId,
            currentProfile.$id,
            {
                coin : coin,
                XP : xp
            }
        )
        return updateTasksleft;
    }
    catch(error){
        throw new Error(error);
    }
}
export const getProfileDates = async (currentProfile) => {
    try {
        const profileDates = await databases.listDocuments(
            databaseId,
            datesCollectionId,
            [Query.equal('profile', currentProfile),Query.orderAsc('date')]
        )      
        return profileDates.documents;
    }
    catch(error){
        throw new Error(error);
    }
}
export const getTasks = async (currentProfile) => {
    try {
        const currentTasks = await databases.listDocuments(
            databaseId,
            tasksCollectionId,
            [Query.equal('profile',currentProfile.$id)]
        )
        if(!currentTasks) throw Error;
        return currentTasks.documents;
    }
    catch(error){
        throw new Error(error);
    }
}
export const createAlltasks = async (currentProfile, all_tasks) => {
    try {
        const currentTasks = await databases.updateDocument(
            databaseId,
            profileDatabaseId,
            currentProfile.$id,
            {
                tasks : all_tasks,
            }
        )
        if(!currentTasks) throw Error;
        return currentTasks;
    }
    catch(error){
        throw new Error(error);
    }
}
export const CreateTask = async (currentProfile, dailyrepeat,weeklyrepeat,task,icon,starting_date) => {
    try{
        const Task = await databases.createDocument(
            databaseId,
            tasksCollectionId,
            ID.unique(),
            {
                profile : currentProfile.$id,
                daily_repeat : dailyrepeat,
                weekly_repeat : weeklyrepeat,
                done : false,
                icon : icon,
                task : task,
                Starting_date : starting_date
            }
        )
        return Task;
    }
    catch(error){
        return new Error(error)
    }
}
export const updateAnythinginProfile = async (currentProfile,xp,coin,diamond,strength,intelligence,agility) => {
    try{
        const updateProfile = databases.updateDocument(
            databaseId,
            profileDatabaseId,
            currentProfile.$id,
            {
                coin : coin? coin : currentProfile.coin,
                XP : xp? xp : currentProfile.XP,
                diamond : diamond? diamond : currentProfile.diamond,
                strength: strength? strength: currentProfile.strength,
                intelligence: intelligence? intelligence : currentProfile.intelligence,
                agility : agility? agility : currentProfile.agility,
            }
        )
        if(!updateProfile){
            throw new Error;
        }
        return updateProfile;
    }
    catch(error){
        throw new Error(error);
    }
}
export const getDefaultAccessories = async (currentProfile) => {
    try{
        const getAccessoryIds = await databases.listDocuments(
            databaseId,
            profileAccessoriesCollectionId,
            [Query.equal('profile',currentProfile.$id)]
        )
        list = getAccessoryIds.documents.map((curr) => curr.accessories.$id);
        const getDefaultAccessories = await databases.listDocuments(
            databaseId,
            accessoriesCollectionId
        )
        if(getAccessoryIds.documents.length == getDefaultAccessories.documents.length) return [];
        converted = getDefaultAccessories.documents.filter((curr) => !list.includes(curr.$id));
        console.log(converted);
        return converted;
    }
    catch(error){
        throw new Error(error);
    }
}
export const getAccessories = async (currentProfile) => {
    try{
        const getDefaultAccessories = await databases.listDocuments(
            databaseId,
            profileAccessoriesCollectionId,
            [Query.equal('profile',currentProfile.$id)]
        )
        list = getDefaultAccessories.documents.map((curr) => curr.accessories);
        return list;
    }   
    catch(error){
        throw new Error(error);
    }
}
export const createProfileAccessories = async (accessories,profile) => {
    try{
        const createProfileAccessories = await databases.createDocument(
            databaseId,
            profileAccessoriesCollectionId,
            ID.unique(),
            {
                accessories : accessories,
                profile : profile
            }
        )
        return createProfileAccessories;
    }
    catch(error){
        throw new Error(error)
    }
}