import React, {useEffect, useRef, useState } from "react";
import {Text, View} from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

import { useGlobalContext } from "@/context/GlobalProvider";
import {updateStats} from "@/lib/appwrite";
import TextFade from "@/components/TextFade";

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const SwipeableBox = ({item,index}) => {
    const { user, profile, setProfile,tasks,setTasks } = useGlobalContext();
    const [initialize, setInitialize] = useState(false);
    const [xp, setXp] = useState(profile.XP);
    const [update, setUpdate] = useState(0);
    const [updateFull, setUpdateFull] = useState(0);
    const [lastSwipe, setlastSwipe] = useState(false);
  
    const [coin, setCoin] = useState(profile.coin);
    const [count,setCount] = useState(0);
  
    const [fadeText, setFadeText] = useState(false);
    const [updateStatusBar, setUpdateStatusBar] = useState(false);
  
    const [started, setStarted] = useState(0)
    const [max,setMax] = useState(0);
  
    const [minusIndex, setMinusIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const swipeableRefs = useRef(new Map());
    useEffect(() => {
        setCount(tasks.length);
      })
      useEffect(() => {
        if(started == 0 && initialize){
          setMax(0);
          setMinusIndex(0);
          setUpdateFull(update + 5);    
          setUpdateStatusBar(true);
          setFadeText(true)   
        }
      }, [started])
      useEffect(() => {
        if(initialize){
          updateStats(profile, coin + updateFull, xp + updateFull);
          setXp(xp + updateFull);
          setCoin(coin + updateFull);
          setTimeout(() => {setFadeText(false);setUpdateStatusBar(false);setUpdateFull(0)}, 1000)
          setUpdate(0); 
        }
        setInitialize(true);
      }, [updateFull])
    useEffect
    const deleteItem = async (item,index,direction) => {
        setMax(Math.max(max,index-minusIndex));
        let updatedItems = null;
        if(index > max && max != 0){
          setMinusIndex(minusIndex - 1);
          updatedItems = tasks.filter((task) => task !== tasks[index - 1 - minusIndex]);
        }
        else{
          updatedItems = tasks.filter((task) => task !== tasks[index - minusIndex]);
        }
    
        onSwipeableOpen(index);
        setTasks(updatedItems);
    
        if(direction == "left"){
          setCount(count - 1);
          setUpdate(update + 5)
        } 
        else{
        }
      };
      const onSwipeableOpen = (index) => {
          const swipeable = swipeableRefs.current.get(index);  
          if (swipeable) {
            swipeable.close();
          }
          setStarted(started-1);
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
      const handleSwipeableOpen = () => {
        if (!isSwiping) {
          setIsSwiping(true);
        }
      };
      const handleSwipeableClose = (item) => {
        setIsSwiping(false);
      };
      const getIcon = (icon,text_color) => {
          const [group, name] = icon.split(",", 2);
          switch(group){
            case "AntDesign" :
                return <AntDesign name={name} size={18} color={text_color}/>
            case "Entypo" :
                return <Entypo name={name} size={18} color={text_color}/>
            case "Feather" :
                return <Feather name={name} size={18} color={text_color}/>
            case "FontAwesome" :
                return <FontAwesome name={name} size={18} color={text_color}/>
            case "MaterialCommunityIcons" : 
                return <MaterialCommunityIcons name={name} size={18} color={text_color}/>
            case "FontAwesome5" : 
                return <FontAwesome5 name={name} size={18} color={text_color}/>
            case "MaterialIcons" : 
                return <MaterialIcons name={name} size={18} color={text_color}/>
            case "Ionicons" : 
                return <Ionicons name={name} size={18} color={text_color}/>
          }
      }
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
        onSwipeableClose={() => {handleSwipeableClose(item)}}
        onSwipeableWillOpen={() => {
          setStarted(started+1);
          handleSwipeableOpen;
        }}
        onSwipeableOpen={(direction) => {deleteItem(item,index,direction)}}
        reset
      > 
         <View className="w-[90%] h-14 mx-auto bg-black-200 mb-5 justify-center items-center">
         {fadeText && <TextFade
                update = {updateFull}
              />}  
               <AntDesign name="doubleleft" size={18} color="red" className="absolute left-1"/>          
               <Text className={`text-center font-medium text-lg`} style={{color: item.color}}>{item.task} {getIcon(item.icon,item.color)}</Text>
               <AntDesign name="doubleright" size={18} color="lime" className="absolute right-1"/>   
         </View>
      </Swipeable>
    </GestureHandlerRootView>
    </View>
  )
}

export default SwipeableBox