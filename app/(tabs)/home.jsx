import { View, Text,FlatList, Alert} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import Progressbar from '@/components/Progressbar';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

import AntDesign from '@expo/vector-icons/AntDesign';
import { updateTask } from '@/lib/appwrite';

LocaleConfig.locales['fr'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthNamesShort: ['Jan', 'Febr', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su','Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};
LocaleConfig.defaultLocale = 'fr';


const renderRightActions = () => {
  return (
    <View className="w-[90%] h-12 bg-red-400  justify-center mx-auto">
      <Text className="text-white text-center">Deleting...</Text>
      <AntDesign name="minuscircle" size={18} color="black" className="absolute right-1"/>
    </View>
  );
};
const renderLeftActions = () => {
  return (
    <View className="w-[90%] h-12 bg-lime-400 justify-center mx-auto">
      <Text className="text-white text-center">Confirming...</Text>
      <AntDesign name="pluscircle" size={18} color="black" className="absolute left-1"/>
    </View>
  );
};

const advantage = [
  { id:'1', title: "- A well formed structure that will help you achieve your goals"},
  { id:'2', title: "- The addition of making it a game so maintining your habits becomes easier "},
  { id:'3', title: "- Large options to customize your experience"},
  { id:'4', title: "- Simple design to make it user friendly"}
]

const home = () => {
  const {user,profile,setProfile} = useGlobalContext();
  const [selected, setSelected] = useState('');
  const [swiped, setSwiped] = useState(false)

  const handleSwipeLeft = (item) => {
    setSwiped(true);
    profile.tasks_left.pop(item);
    console.log(profile.tasks_left);
    //updateTask(profile);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
          data = {profile.tasks_left}
          renderItem={({item}) => (
            <GestureHandlerRootView style={{ flex : 1}}>
               <View className=''>
                <Swipeable 
                  renderRightActions={swiped ? null : renderRightActions} 
                  renderLeftActions={swiped ? null : renderLeftActions}
                  onSwipeableWillOpen={(direction) => {               
                      if(!swiped){
                          if(direction === 'right'){handleSwipeLeft(item)}
                      }
                  }}
                  onActivated={setSwiped(false)}
                >
                  <View className="w-[90%] h-12 mx-auto bg-black-200 mb-5 justify-center">
                    <AntDesign name="doubleleft" size={18} color="red" className="absolute left-1"/>                
                    <Text className="text-center text-white font-medium">{item}</Text>
                    <AntDesign name="doubleright" size={18} color="lime" className="absolute right-1"/>
                  </View>
                </Swipeable>
              </View>
            </GestureHandlerRootView>
          )}
          ListHeaderComponent={() => (
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
                  title = "Level"
                  level = {profile?.level}
                  current = {profile?.XP}
                  max = {profile?.level*50}
                  color = "bg-blue-600"
                  text = "XP"
                  styleContainer="mb-5"
                />
                <Progressbar
                  current = {profile?.HP}
                  max = {50}
                  color = "bg-red-500"
                  text = "HP"
                />
                <View className='flex-row space-x-2 justify-end mt-2'>
                    <FontAwesome5 name="gem" size={18} color="green" className="mr-1 mt-1" />
                    <Text className='text-xl font-psemibold text-white text-right mr-4'>
                      {profile?.diamond}
                    </Text>
                    
                    <FontAwesome5 name="coins" size={18} color="orange" className="mr-1 mt-1"/>  
                    <Text className='text-xl font-psemibold text-white text-right'>
                      {profile?.coin}
                    </Text>    
                  </View>
                {/*<View className='mt-7'>
                  <Calendar
                    firstDay = {1}
                    theme={{
                      backgroundColor: '#161622',
                      calendarBackground: '#161622',
                      textSectionTitleColor: '#b6c1cd',
                      selectedDayBackgroundColor: '#00adf5',
                      selectedDayTextColor: '#ffffff',
                      todayTextColor: '#00adf5',
                      dayTextColor: '#2d4150',
                      textDisabledColor: '#d9e1e8',
                      dotColor: '#00adf5',
                      selectedDotColor: '#ffffff',
                      arrowColor: '60a5fa',
                      monthTextColor: 'white',
                      textDayFontFamily: 'Poppins-Medium',
                      textMonthFontFamily: 'Poppins-Bold',
                      textDayHeaderFontFamily: 'Poppins-Medium',
                      textDayFontSize: 16,
                      textMonthFontSize: 20,
                      textDayHeaderFontSize: 18,
                    }}
                    onDayPress={day => {
                      setSelected(day.dateString);
                    }}
                    markedDates={{
                      '2024-11-15': { selected: true, marked: true, selectedColor: 'blue' },
                      '2024-11-16': { marked: true },
                      '2024-11-17': { marked: true, dotColor: 'red' },
                    }}
                  />
                </View>*/}          
              </View>
            </View>
          )}
      />
    </SafeAreaView>

  )
}

export default home