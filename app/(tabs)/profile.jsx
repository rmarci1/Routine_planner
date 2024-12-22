import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import Progressbar from '@/components/Progressbar';
import { getRank } from '@/constants/rank';
import { updateAnythinginProfile } from '@/lib/appwrite';
import CustomButton from '@/components/CustomButton';

const profile = () => {
  const {user,profile,setProfile} = useGlobalContext();
  const [form,setForm] = useState({
    strength : 0,
    intelligence : 0,
    agility : 0,
  });
  
  const [changebar, setChangeBar] = useState({
    strength : 0,
    intelligence : 0,
    agility : 0,
  })
  const [change,setChange] = useState(false);
  const [rank,setRank] = useState(getRank(profile.level));
  const [maxLevel,setMaxLevel] = useState(5);
  const [level,setLevel] = useState(0);

  const statToChange = (stat,change) => {
    if (!(level + change > maxLevel || level + change < 0)){
      switch(stat){
        case "strength" :
          if(!(form.strength + change < 0)){
            setForm({...form, strength: form.strength + change});
            setLevel(level + change);
          }    
          break;
        case "intelligence" : 
          if(!(form.intelligence + change < 0)){
            setForm({...form, intelligence: form.intelligence + change});
            setLevel(level + change);
          }     
          break;
        case "agility" : 
          if(!(form.agility + change < 0)){
            setForm({...form, agility: form.agility + change});
            setLevel(level + change);
          } 
          break;
      }
    }
  }
  const handleClick = (operation, stat) => {
    console.log(change);
    if(!change){
      setChange(true);
    }
    switch(operation){
      case "plus" :
          statToChange(stat, 1)
          break;
      case "minus" :
          statToChange(stat, -1)
          break;
    }
  }
  const submit = async () => {
    try{
      setChangeBar({strength: form.strength, intelligence:  form.intelligence, agility: form.agility});
      const response = await updateAnythinginProfile(profile,0,0,0,profile.strength + form.strength,profile.intelligence + form.intelligence,profile.agility + form.agility);
      setProfile(response);
      setChange(false);
      setMaxLevel(maxLevel-level);
      setLevel(0);
      setTimeout(() => {setForm({strength : 0, intelligence : 0, agility : 0}),setChangeBar({strength : 0, intelligence : 0, agility : 0})}, 1000) 
    }
    catch(error){
      throw new Error(error);
    }
  }
  return (
    <SafeAreaView className='h-full bg-primary'>
      <Text className='text-3xl font-pregular text-white text-center mt-4'>{user.username}<Text className={`${rank[1]} text-xl ml-2`}>({rank[0]})</Text></Text>
      <Text className='text-right text-2xl text-purple-400 font-psemibold'><Text className='font-pbold'>{maxLevel-level}</Text> points left</Text>
      <Text className='text-red-500 font-pbold text-xl'>Strength</Text>
      <Progressbar
        stat = "strength"
        current={profile.strength}
        max={100}
        color="bg-red-500"
        styleContainer="mt-1"
        change={changebar.strength != 0}
        profile = {maxLevel > 0}
        handleclick={handleClick}
        spentPoints = {form.strength}
      />
      <Text className='text-cyan-400 font-pbold text-xl my-2'>Intelligence</Text>
      <Progressbar
        stat = "intelligence"
        current={profile.intelligence}
        max={100}
        color="bg-cyan-400"
        styleContainer=""
        change={changebar.intelligence != 0}
        profile = {maxLevel > 0}
        handleclick={handleClick}
        spentPoints = {form.intelligence}
      />
      <Text className='text-lime-400 font-pbold text-xl my-2'>Agility</Text>
      <Progressbar
        stat = "agility"
        current={profile.agility}
        max={100}
        color="bg-lime-400"
        styleContainer=""
        change={changebar.agility != 0}
        profile = {maxLevel > 0}
        handleclick={handleClick}
        spentPoints = {form.agility}       
      />
      {maxLevel > 0 &&
      <View className='items-end mt-3'>
        <TouchableOpacity
          onPress={submit}
          activeOpacity={0.7}
          className='h-10 w-[40%] bg-purple-400 rounded-lg justify-center items-center'
        >
          <Text className='font-pregular text-white text-xl'>Spend Points</Text>
        </TouchableOpacity>
      </View>}
      
    </SafeAreaView>
  )
}

export default profile