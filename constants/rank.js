import { View } from "react-native";

export const getRank = (level) => {
    switch(true){
        case level < 5:
            return ["Newbie","text-green-400"];
        case level < 12:
            return ["Novice","text-lime-400"]
        case level < 20:
            return ["Trained","text-blue-400"]
        case level < 30:
            return ["Apprentice","text-blue-600"];
        case level < 50:
            return ["Skilled", "text-violet-400"];       
    }
}