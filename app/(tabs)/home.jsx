import React, { useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import Progressbar from "@/components/Progressbar";
import { useGlobalContext } from "@/context/GlobalProvider";

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import EmptyState from "@/components/EmptyState";
import TextFade from "@/components/TextFade";
const SwipeableList = () => {

  const { user, profile, setProfile } = useGlobalContext();

  const [items, setItems] = useState(profile.tasks_left);
  const [count,setCount] = useState(profile.tasks_left.length);
  const [fadeText, setFadeText] = useState(false);
  const deleteItem = (item) => {
    const updatedItems = items.filter((task) => task !== item);
    setItems(updatedItems);
    setCount(count - 1);
    setFadeText(true);
    setTimeout(() => setFadeText(false), 1500)
  };

  const renderRightActions = (item) => {
    return (
      <View className="w-[90%] h-12 mx-auto bg-red-400 justify-center">
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

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        onSwipeableWillClose={() => console.log(`Closed: ${item}`)}
        onSwipeableOpen={() => deleteItem(item)}
      > 
         <View className="w-[90%] h-12 mx-auto bg-black-200 mb-5 justify-center">
               <AntDesign name="doubleleft" size={18} color="red" className="absolute left-1"/>          
               <Text className="text-center text-white font-medium">{item}</Text>
               <AntDesign name="doubleright" size={18} color="lime" className="absolute right-1"/>
             </View>
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <SafeAreaView className='bg-primary h-full'>
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item,index) => index.toString()}
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
                {/*<View className='flex-row items-center space-x-2'>
                    <Text className='text-2xl font-psemibold text-white text-right mr-2'>
                      {profile?.coin}
                    </Text>
                    <FontAwesome5 name="coins" size={30} color="orange"/>
                  </View>*/}
              </View>

        <Progressbar
        title="Level"
        level={profile?.level}
        current={profile?.XP}
        max={profile?.level * 50}
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
                  {profile?.coin}
                </Text>
              </View>
              <View className='justify-center mt-4 flex-row items-center'>
                  <Text className='text-white font-pregular text-xl'> {profile.tasks.length - count} </Text>
                  <AntDesign name="check" size={24} color="green" />
                  <Text className='text-white font-pregular text-xl'> {count} </Text>
                  <AntDesign name="close" size={24} color="red" />
              </View>
              {fadeText && <TextFade/>}      
      </View>
      </View>
      }
      contentContainerStyle = {styles.listContent}
        ListEmptyComponent={
          <View>
            <EmptyState/>
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
