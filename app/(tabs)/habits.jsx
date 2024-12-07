import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CreateTask, getProfileDates, useAppwrite } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import FormField from '@/components/FormField';
import LogoButton from '@/components/LogoButton';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import SwipeableBox from '@/components/SwipeableBox';
import EmptyState from '@/components/EmptyState';
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
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};
LocaleConfig.defaultLocale = 'fr';

const habits = () => {
  const {profile,tasks,setTasks} = useGlobalContext();
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState({
    dailyRepeat : false,
    weeklyRepeat: false,
    task : "",
    icon : "",
    date : new Date()
  });                                               
  const {data : dates,isloading} = useAppwrite(
    () => getProfileDates(profile.$id)
  );
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [markedDates, setMarkedDates] = useState({});
  const [isPressed,setIsPressed] = useState(false);
  const [initialize,setInitialize] = useState(true);
  const [previous,setPrevious] = useState("");
  const [previousData,setPreviousData] = useState({});

  const [show,setShow] = useState(false);
  useEffect(() => {
      if(!isloading){
        const formattedDates = getRange();
        setMarkedDates(formattedDates);
      }
  }, [dates,isloading]);
  useEffect(() => {
    if(!isloading && !initialize){
      let current = markedDates;
      setPreviousData(current[selected]);
      if(previous != ""){
        if(previousData != undefined){
          current[previous] = previousData
        }
        else{
          current[previous] = {
          }
        }
      }
      current[selected] = {
        startingDay: true,
        endingDay: true,
        color: "#c084fc",
        textColor: "white"
      }
      const list = filteredTasks.filter((task) => (new Date(task.Starting_date).toISOString().split('T')[0] === selected || task.daily_repeat ? true : task.weekly_repeat? new Date(task.Starting_date).getDay() === new Date(selected).getDay() : false)); 
      setFilteredTasks(list);
      setPrevious(selected);
      setMarkedDates(current);
      setShow(selected !== new Date().toISOString().split('T')[0]);
    }
    setInitialize(false);
  },[selected])
  
  const getRange = () => {
    const Dates = {};
    let startDate = new Date(dates[0].date).toISOString().split('T')[0];
    for (let index = 0; index < dates.length-1; index++) {
      let currentDate = new Date(dates[index].date);
      let done = dates[index].done;
      let Nextdone = dates[index+1].done;
      const dateStr = currentDate.toISOString().split('T')[0];
      let currentDay = parseInt(currentDate.getDay());
      let firstPart = new Date(currentDate.setDate(parseInt(currentDate.getDate()) + 1)).toISOString().split('T')[0];
      let secondPart = new Date(dates[index + 1].date).toISOString().split('T')[0];

      if(currentDay !== 0 && firstPart === secondPart && done && Nextdone){
        Dates[dateStr] = {
          startingDay : dateStr === startDate,
          color: "aqua",
        }
      }
      else {
        if(done){
          Dates[dateStr] = {
            endingDay : true,
            color: 'aqua',
          }
        }
        startDate = new Date(dates[index+1].date).toISOString().split('T')[0];
      }    
    }
    const last = new Date(dates[dates.length-2].date);
    const lastday = new Date(dates[dates.length-1].date).toISOString().split('T')[0];
    Dates[lastday] = {
      startingDay: new Date(last.setDate(last.getDate() + 1)).toISOString().split('T')[0] !== lastday,
      endingDay : true,
      color : 'aqua',
    }
    return Dates;
  }
  const eventHandlerer = () => {
    setForm({...form, date: selected === "" ? date : selected})
    setIsPressed(true);
  }
  const change = (group,name) => {
    setForm({...form,icon:`${group},${name}`});
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    setIsSubmitting(true);
    if(!form.task){
      Alert.alert("Error","You need to enter a task")
      return;
    }
    if(!form.icon){
      Alert.alert("Error","You need to choose a task")
      return;
    }
    try{
        const result = await CreateTask(profile,form.dailyRepeat,form.weeklyRepeat,form.task,form.icon);
        let tasks_list = tasks;
        tasks_list.push(result);
        setTasks(tasks_list);
        setIsPressed(false);
        router.push('/home');

    }
    catch(error){
      Alert.alert('Error',error.message)
    }
    finally{
      setForm({
        dailyRepeat : false,
        weeklyRepeat: false,
        task : "",
        icon : "",
      })
      setIsSubmitting(false);
    }
  }
  return (
    <SafeAreaView className='h-full bg-primary'>
      {isPressed ?      
      ( 
        <ScrollView>
        <View className='justify-center mt-3'>
          <View className='justify-between mt-5 flex-row'>
            <Text className='text-center text-white font-pbold ml-8 text-2xl'>Create a <Text className='text-purple-400'>Task</Text></Text>
            <TouchableOpacity
              onPress={() =>setIsPressed(false)}
            >
                <AntDesign name="minus" size={30} color="#b5bec9" className='mr-8'/>
            </TouchableOpacity>
          </View>
        </View>
      <View className='flex-row items-center mt-5 justify-center'>
      
       <Text className='text-white text-lg font-pmedium'>Daily repeat: </Text>
       <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor='#f4f3f4'
          onValueChange={() => {
            console.log("1");
            setForm({...form, dailyRepeat: !form.dailyRepeat});
            if(form.weeklyRepeat){
              setForm({...form, weeklyRepeat:false, dailyRepeat: true})
            }
          }}
          value = {form.dailyRepeat}
        />
        <Text className='text-white text-lg font-pmedium'>Weekly repeat: </Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor='#f4f3f4'
          onValueChange={() => {
            console.log("2");
            setForm({...form, weeklyRepeat: !form.weeklyRepeat});
            if(form.dailyRepeat){
              setForm({...form, dailyRepeat: false, weeklyRepeat:true})
            }
          }}
          value = {form.weeklyRepeat}
        />
        </View>
        <View>
        <FormField
          title="Task: "
          value={form.task}
          handleChangeText={(e) =>setForm({
            ...form, task:e
          })}
          placeholder="Enter a task you want to do"
          otherStyles = "mt-7 ml-4"
        />
        
        <View className='mt-5 ml-4'>
            <Text className='text-white text-2xl font-psemibold'>Icon: </Text>
            <View className='bg-black-200 rounded-2xl mt-3'>
              <Text className='text-xl font-light text-white text-center my-3'>Hobbies </Text>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 my-2'>
                  <LogoButton
                    logo = {<Feather name="book" size={24} color="white" />}
                    change={() => change("Feather","book")}
                  />
                  <LogoButton
                    logo={<MaterialCommunityIcons name="meditation" size={26} color="white" />}
                    change={() => change("MaterialCommunityIcons","meditation")}
                  />
                  <LogoButton
                    logo = {<AntDesign name="camerao" size={24} color="white" />}
                    change={() => change("AntDesign","camerao")}
                  />
                  <LogoButton
                      logo={<Entypo name="language" size={24} color="white" />}
                      change={() => change("Entypo","language")}
                  />
                  <LogoButton
                    logo={<Entypo name="game-controller" size={24} color="white" />}
                    change={() => change("Entypo","game-controller")}
                  />
              </View>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 m-auto w-[75%]'>
                  <LogoButton
                    logo={<FontAwesome name="code" size={24} color="white" />}
                    change={() => change("FontAwesome","code")}
                  />
                  <LogoButton
                    logo={<Entypo name="note" size={24} color="white"  />}
                    change={() => change("Entypo","note")}
                  />
                  <LogoButton
                    logo={<Entypo name="palette" size={24} color="white"  />}
                    change={() => change("Entypo","palette")}
                  />
              </View>
              <Text className='text-xl font-light text-blue-400 text-center my-3'>Exercise </Text>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 mt-2'>
                  <LogoButton
                    logo={<FontAwesome5 name="running" size={26} color="#60a5fa" />}
                    change={() => change("FontAwesome5","running")}
                  />
                  <LogoButton
                    logo={<AntDesign name="dribbble" size={26} color="#60a5fa" />}
                    change={() => change("AntDesign","dribbble")}
                  />
                  <LogoButton
                    logo={<MaterialIcons name="sports-gymnastics" size={26} color="#60a5fa" />}
                    change={() => change("MaterialIcons","sports-gymnastics")}
                  />
                  <LogoButton
                    logo={<MaterialCommunityIcons name="weight-lifter" size={26} color="#60a5fa" />}
                    change={() => change("MaterialCommunityIcons","weight-lifter")}
                  />
                  <LogoButton
                    logo={<FontAwesome name="bicycle" size={24} color="#60a5fa" />}
                    change={() => change("FontAwesome","bicycle")}
                  />
                 
              </View>
              <Text className='text-xl font-light text-purple-400 text-center my-3'>Routine </Text>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 mt-2'>
                  <LogoButton
                    logo={<Entypo name="moon" size={24} color="#c084fc" />}
                    change={() => change("Entypo","moon")}
                  />
                  <LogoButton
                    logo={<Ionicons name="journal" size={24} color="#c084fc" />}
                    change={() => change("Ionicons","journal")}
                  />
                  <LogoButton
                    logo={<Feather name="sun" size={24} color="#c084fc" />}
                    change={() => change("Feather","sun")}
                  />
                  <LogoButton
                    logo={<AntDesign name="skin" size={24} color="#c084fc" />}
                    change={() => change("AntDesign","skin")}
                  />
                 <LogoButton
                    logo={<AntDesign name="rest" size={24} color="#c084fc" />}
                    change={() => change("AntDesign","rest")}
                  />
              </View>
              <Text className='text-xl font-light text-[#c49960] text-center my-3'>Work </Text>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 mt-2'>
                  <LogoButton
                    logo = { <AntDesign name="phone" size={24} color="#c49960" />}
                    change={() => change("AntDesign","phone")}
                  />
                  <LogoButton
                    logo={<Entypo name="text-document" size={24} color="#c49960" />}
                    change={() => change("Entypo","text-document")}
                  />
                  <LogoButton
                    logo={<Feather name="calendar" size={24} color="#c49960" />}
                    change={() => change("Feather","calendar")}
                  />
                  <LogoButton
                    logo = {<AntDesign name="clockcircleo" size={24} color="#c49960" />}
                    change={() => change("AntDesign","clockcircleo")}
                  />
                  <LogoButton
                    logo = {<AntDesign name="home" size={24} color="#c49960" />}
                    change={() => change("AntDesign","home")}
                  />
                  <LogoButton
                    logo = {<AntDesign name="shoppingcart" size={24} color="#c49960" />}
                    change={() => change("AntDesign","shoppingcart")}
                  />
                  <LogoButton
                    logo={<AntDesign name="iconfontdesktop" size={24} color="#c49960" />}
                    change={() => change("AntDesign","iconfontdesktop")}
                  />
              </View>
              <View className='flex-row h-12 justify-between items-center pl-3 pr-3 mt-2 w-[60%] mx-auto'>
                  <LogoButton
                    logo={<Entypo name="suitcase" size={24} color="#c49960" />}
                    change={() => change("Entypo","suitcase")}
                  />
                   <LogoButton
                    logo={<Entypo name="mail" size={24} color="#c49960" />}
                    change={() => change("Entypo","mail")}
                  />
                  <LogoButton
                    logo={<Entypo name="message" size={24} color="#c49960" />}
                    change={() => change("Entypo","message")}
                  />
              </View>
            </View>
        </View>
        <CustomButton 
          title= "Create task"
          handlePress={submit}
          containerStyles="my-5 ml-3 bg-purple-400"
        />
        </View>
        </ScrollView>
      ) : 
      (
      <View>
        <FlatList
          data={!show ? tasks : filteredTasks}
          renderItem={({item,index}) => (
            <View>
            {!show ? (
              <View>
                <SwipeableBox
                item = {item}
                index = {index}
             /> 
              </View>) : 
              (
                <View>
                  <Text className='text-3xl text-blue-400 font-pregular'>{item.task}</Text>
                </View>
              )
            }
          </View>
            )
          }
          keyExtractor={(item,index) => index.toString()}
          ListHeaderComponent={
            <View>
              <View className='mt-10 px-6'>
                <Text className='text-3xl font-pbold text-white'>Your <Text className='text-purple-400'>schedule</Text></Text>
              </View>
              <View>
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
                  markingType = {'period'}
                  markedDates={markedDates}
                  className="h-20"
                />
              </View>
              <View className='justify-center mt-1 mb-4'>
                <View className='justify-end mt-5 flex-row mr-4'>
                    <TouchableOpacity
                      onPress={eventHandlerer}
                    >
                      <AntDesign name="plus" size={24} color="#b5bec9"/>
                    </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View>
              <EmptyState
                state={selected === new Date? true:false}
              />
            </View>
          }
        />
       </View>
      )}
    </SafeAreaView>
  )
}
export default habits