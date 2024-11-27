import { createAlltasks, getCurrentProfile, getCurrentUser, getTasks } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [isProfileIn, setIsProfileIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        getCurrentUser()
        .then((res) => {
            if(res) {
                setIsLoggedIn(true);
                setUser(res);
            }
            else{
                setIsLoggedIn(false);
                setUser(null);
            }
            if(!res.remember){
                setIsLoggedIn(false);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, []);
    useEffect(() => {
        getCurrentProfile()
        .then((res) => {
            setIsLoading(true);
            if(res) {
                setIsProfileIn(true);
                setProfile(res);
                let all_tasks = [];
                let remaining_tasks = [];
                
                getTasks(res)
                .then( async (task) => {
                    task.forEach(element => {
                        all_tasks.push(element.task);
                        if(!element.done){
                            remaining_tasks.push(element.task);
                        }
                    });
                    let new_profile = await createAlltasks(res,all_tasks,remaining_tasks);
                    setProfile(new_profile);
                });
            }
            else{
                setProfile(null);
                setIsProfileIn(false);
            }   
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, []);
    useEffect(() => {
    }, []);
    return (
        <GlobalContext.Provider
            value = {{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                profile,
                setProfile,
                isProfileIn,
                setIsProfileIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider;