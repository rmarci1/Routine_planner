import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocaleConfig } from 'react-native-calendars';
import moment from 'moment';

import { useGlobalContext } from "@/context/GlobalProvider";
import { getTasks, updateStats, useAppwrite } from "@/lib/appwrite";
import Progressbar from "@/components/Progressbar";
import EmptyState from "@/components/EmptyState";
import TextFade from "@/components/TextFade";

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const SwipeableList = () => {

  const { user, profile, setProfile,tasks,setTasks } = useGlobalContext();
  const [initialize, setInitialize] = useState(false);
  const [xp, setXp] = useState(profile.XP);
  const [updateFull, setUpdateFull] = useState(0);

  const [coin, setCoin] = useState(profile.coin);
  const [count,setCount] = useState(0);

  const [fadeText, setFadeText] = useState(false);
  const [updateStatusBar, setUpdateStatusBar] = useState(false);

  const [isSwiping, setIsSwiping] = useState(false);
  const [indexlist, setindexList] = useState([]);
  const [limit,setLimit] = useState(0);
  const swipeableRefs = useRef(new Map());
  /*const [currentWeek, setCurrentWeek] = useState(moment());*/
  useEffect(() => {
    setCount(tasks.length);
  })
  /*const getWeekDays = () => {
    const startOfWeek = currentWeek.clone().startOf('week');
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(startOfWeek.clone().add(i, 'days'));
    }
    return weekDays;
  };

  const changeWeek = (direction) => {
    setCurrentWeek((prev) => prev.clone().add(direction === 'next' ? 7 : -7, 'days'));
  };*/

  const deleteItem = (direction) => {
    let list = [...new Set(indexlist)];
    let updatedItems = tasks;
    let update = 0;
    list.sort((a,b) => b-a);
    console.log(list);
    for (let index = 0; index < list.length; index++) {
      onSwipeableOpen(list[index]);
      updatedItems = updatedItems.filter((task) => task !== tasks[list[index]]);
      update+=5;
    }
    setTasks(updatedItems);
    setUpdateFull(update);
    setXp(xp + update);
    setCoin(xp + update);
    updateStats(profile, coin + update, xp + update)
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
  const renderItem = ({ item,index }) => (
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
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <SafeAreaView className='bg-primary h-full'>
    <FlatList
      data={tasks}
      scrollEnabled = {false}
      nestedScrollEnabled = {true}
      renderItem={renderItem}
      keyExtractor={(item,index) => index.toString()}
      pointerEvents={isSwiping ? 'none' : 'auto'}  
      ListHeaderComponent={
        <View>
          <View className='my-6 px-4 space-y-6'>
              <View className='justify-between item-center flex-row mb-5'>
                <View className='flex-col'>
                  <Text className='text-gray-100 text-lg font-medium'>
                    Welcome Back
                  </Text>
                  <Text className='text-2xl font-psemibold text-white'>
                    {user?.username}
                  </Text> 
                </View>
                <View className='flex-row items-center space-x-2'>
                    <Feather name="settings" size={28} color="white"  />
                </View>
              </View>
              {/*<View className="p-4">
                <View className="flex-row justify-between items-center mb-4">
                  <TouchableOpacity onPress={() => changeWeek('prev')} className="p-2 rounded-lg">
                    <AntDesign name="caretleft" size={20} color="white" />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-white">{currentWeek.format('MMM YYYY')}</Text>
                  <TouchableOpacity onPress={() => changeWeek('next')} className="p-2 rounded">
                    <AntDesign name="caretright" size={20} color="white" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between">
                  {getWeekDays().map((day) => (
                    <TouchableOpacity
                      key={day.format('YYYY-MM-DD')}
                      className="flex items-center bg-black w-12 h-16"
                      style = {{
                        borderWidth : 1,
                        borderColor : "#e3e3e3",
                        borderRadius: 8,
                      }}
                    > 
                      <Text className="font-pbold text-gray-400" style={{fontSize: 13}}>{day.format('ddd')}</Text>
                      <Text className="text-lg text-white pb-2">{day.format('D')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>*/}
              <Progressbar
                title="Level"
                level={profile?.level}
                current={xp}
                change = {updateStatusBar}
                max={profile?.level * 600}
                color="bg-blue-600"
                text="XP"
                styleContainer="mb-5"
              />
              <Progressbar
                current={profile?.HP}
                max={50}
                color="bg-red-500"
                text="HP"
              />
             <View className='flex-row space-x-2 justify-end mt-2'>
                <FontAwesome5 name="gem" size={18} color="green" className="mr-1 mt-1" />
                <Text className='text-xl font-psemibold text-white text-right mr-4'>
                  {profile?.diamond}
                </Text>

                <FontAwesome5 name="coins" size={18} color="orange" className="mr-1 mt-1" />
                <Text className='text-xl font-psemibold text-white text-right'>
                  {coin}
                </Text>
              </View>
              <View className='justify-center mt-4 flex-row'>
                  <Text className='text-white font-pregular text-xl'> {count} </Text>
                  <AntDesign name="close" size={24} color="red" className="mr-4"/>
                  <Text className='text-white font-pregular text-xl'> {profile.tasks.length - count} </Text>
                  <AntDesign name="check" size={24} color="green"/>
              </View>
              {fadeText && <TextFade
                update = {updateFull}
              />}   
              <View className='mt-7'>
              </View>

          </View>
        </View>
      }
      contentContainerStyle = {styles.listContent}
      ListEmptyComponent={
          <View>
            <EmptyState
              state={profile.tasks.length>0? true:false}
            />
          </View>
        }
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1, // Ensures the content fills the available space
  },
});
export default SwipeableList;
