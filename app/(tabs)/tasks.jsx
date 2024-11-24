import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getProfileDates, useAppwrite } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';

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

const tasks = () => {
  const {profile} = useGlobalContext();
  const [selected, setSelected] = useState("");
  const {data : dates,isloading} = useAppwrite(
    () => getProfileDates(profile.$id)
  );
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
      if(!isloading){
        const formattedDates = getRange();
        setMarkedDates(formattedDates);
      }
  }, [dates,isloading]);
  
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

      console.log(done)
      if(currentDay !== 0 && firstPart === secondPart && done && Nextdone){
        Dates[dateStr] = {
          startingDay : dateStr === startDate,
          color: "aqua",
        }
      }
      else {
        console.log("done: " + done)
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

  return (
    <SafeAreaView className='h-full bg-primary'>
      <View className='mt-10 px-6'>
        <Text className='text-3xl font-pbold text-white'>Your schedule</Text>
      </View>
      <View className='mt-4'>
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

        />
      </View>
    </SafeAreaView>
  )
}

export default tasks