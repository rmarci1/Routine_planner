import { createAlltasks, getAccessories, getCurrentProfile, getCurrentUser, getDefaultAccessories, getTasks } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
    const [isProfileIn, setIsProfileIn] = useState(false);
    const [isTasksIn, setIsTasksIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAccessoriesIn, setIsAccessoriesIn] = useState(false);
    const [isDefaultAccessoriesIn, setIsDefaultAccessoriesIn] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [accessories, setAccessories] = useState(null);
    const [defaultAccessories, setDefaultAccessories] = useState(null);
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
        })
    }, []);
    useEffect(() => {
        getCurrentProfile()
        .then((res) => {
            if(res) {
                setIsProfileIn(true);
                let all_tasks = [];
                let remaining_tasks = [];
                
                getTasks(res)
                .then( async (task) => {
                    if(task){
                        task.forEach(element => {
                            all_tasks.push(element.task);
                            if(!element.done){
                                remaining_tasks.push(element);
                            }
                        });
                        let new_profile = await createAlltasks(res,all_tasks);
                        setProfile(new_profile);
                        setTasks(remaining_tasks);
                        setIsTasksIn(true)
                    }
                    else{
                        setIsTasksIn(false);
                        setTasks(null);
                    }
                });
                getAccessories(res)
                .then((result) => {
                    if(result){
                        setAccessories(result);
                        setIsAccessoriesIn(true);
                    }
                    else{
                        setAccessories(null);
                        setIsAccessoriesIn(false);
                    }
                });
                getDefaultAccessories(res)
                .then((result) => {
                    if(result){
                        setDefaultAccessories(result);
                        setIsDefaultAccessoriesIn(true);
                    }
                    else{
                        setDefaultAccessories(null);
                        setIsDefaultAccessoriesIn(false);
                    }
                })
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
                setIsProfileIn,
                tasks,
                setTasks,
                isTasksIn,
                setIsTasksIn,
                accessories,
                setAccessories,
                isAccessoriesIn,
                setIsAccessoriesIn,
                defaultAccessories, 
                setDefaultAccessories,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider;