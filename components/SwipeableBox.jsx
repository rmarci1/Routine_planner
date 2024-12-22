import React, {useEffect, useRef, useState } from "react";
import {Text, View} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import { useGlobalContext } from "@/context/GlobalProvider";
import {updateAnythinginProfile, updateStats} from "@/lib/appwrite";
import TextFade from "@/components/TextFade";

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getIcon } from "@/constants/icon";

const SwipeableBox = ({item,index}) => {
    const { user, profile, setProfile,tasks,setTasks} = useGlobalContext();
    const [updateFull, setUpdateFull] = useState(0);
  
    const [count,setCount] = useState(0);
    const [limit, setLimit] = useState(0);
    const [fadeText, setFadeText] = useState(false);
    const [updateStatusBar, setUpdateStatusBar] = useState(false);
    const [indexlist, setindexList] = useState([]);
    const [isSwiping, setIsSwiping] = useState(false);

    const swipeableRefs = useRef(new Map());
    useEffect(() => {
        setCount(tasks.length);
      })
      const deleteItem = async (item,index,direction) => {
          let list = [...new Set(indexlist)];
          let updatedItems = tasks;
          let update = 0;
          list.sort((a,b) => b-a);
          for (let index = 0; index < list.length; index++) {
            onSwipeableOpen(list[index]);
            updatedItems = updatedItems.filter((task) => task !== tasks[list[index]]);
            update+=5;
          }
          setTasks(updatedItems);
          setUpdateFull(update);

          const result = await updateAnythinginProfile(profile,profile.XP + update, profile.coin + update);
          setProfile(result);
          setUpdateStatusBar(true);
          setFadeText(true);   
          setTimeout(() => {setFadeText(false);setUpdateStatusBar(false);setUpdateFull(0)}, 1000)

          setindexList([]);
          setIsSwiping(false);
      };
      const onSwipeableOpen = (index) => {
        const swipeable = swipeableRefs.current.get(index);  
        if (swipeable) {
          swipeable.close();
        } 
    }
      const renderRightActions = (item) => {
        return (
          <View className="w-[90%] h-14 mx-auto bg-red-400 justify-center">
          <Text className="text-white text-center">Deleting...</Text>
          <AntDesign
            name="minuscircle"
            size={18}
            color="black"
            className="absolute right-1"
          />
        </View>
        );
      };
      const renderLeftActions = (item) => {
        return (
          <View className="w-[90%] h-14 bg-lime-400 justify-center mx-auto">
            <Text className="text-white text-center">Completing...</Text>
            <AntDesign name="pluscircle" size={18} color="black" className="absolute left-1"/>
          </View>
        );
    
      };
  return (
    <View>
    <GestureHandlerRootView>
    <Swipeable    
        enabled = {!isSwiping}
        friction={0.8}
        leftThreshold={80}
        ref={(ref) => swipeableRefs.current.set(index,ref)}
        renderRightActions={() => renderRightActions(item)}
        renderLeftActions={() => renderLeftActions(item)}
        onSwipeableWillOpen={() => {
          if(limit>1){
            setIsSwiping(true);
          }
          setLimit(limit+1);
          setindexList([...indexlist, index]);
        }}
        onSwipeableOpen={(direction) => {deleteItem(item,index,direction)}}
        reset
      > 
         <View className="w-[90%] h-14 mx-auto bg-black-200 mb-5 justify-center items-center">
               <AntDesign name="doubleleft" size={18} color="red" className="absolute left-1"/>          
               <Text className={`text-center font-medium text-lg`} style={{color: item.color}}>{item.task} {getIcon(item.icon,item.color)}</Text>
               <AntDesign name="doubleright" size={18} color="lime" className="absolute right-1"/>        
          </View>
          {
             fadeText && (
                <TextFade
                  update = {updateFull}
                />
             )
          }
      </Swipeable>
    </GestureHandlerRootView>
    </View>
  )
}

export default SwipeableBox