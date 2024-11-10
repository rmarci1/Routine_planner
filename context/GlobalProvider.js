import { getCurrentProfile, getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) =>{
    const [isLoggedIn, setIsLoggedIn] = useState(false);    
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
   
    return (
        <GlobalContext.Provider
            value = {{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                profile,
                setProfile
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export default GlobalProvider;