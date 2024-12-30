import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import * as Animatable from 'react-native-animatable'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider'
import { SafeAreaView } from 'react-native-safe-area-context';
import Progressbar from '@/components/Progressbar';
import { getRank } from '@/constants/rank';
import { updateAnythinginProfile } from '@/lib/appwrite';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FaBeer } from 'react-icons/fa';
import { getIcon } from '@/constants/icon';
const profile = () => {
  const {user,profile,setProfile,accessories,setAccessories} = useGlobalContext();
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
  const [types,setTypes] = useState({
    hat : [],
    chest : [],
    leggings: [],
    shoe: [],
  })

  const [change,setChange] = useState(false);
  const [rank,setRank] = useState(getRank(profile.level));
  const [maxLevel,setMaxLevel] = useState(5);
  const [level,setLevel] = useState(0);

  const [show,setShow] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  useEffect(() => {
    let hat = [{$id:"empty0"}];
    let chest = [];
    let leggings = [];
    let shoe =  [];
    accessories.forEach(element => {
      switch(element.type){
        case "hat" :
          hat.push(element)
        case "chest" :
          chest.push(element)
        case "leggings" :
          leggings.push(element)
        case "shoe" :
          shoe.push(element)
      }
    });
    hat.push({$id: "empty1"});
    setTypes({hat:hat, chest:chest, leggings:leggings, shoe:shoe})
  },[])

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
  const zoomIn = {
    0: {
      scale: 0.9
    },
    1: {
      scale:1.1
    }
  }
  const zoomOut = {
    0: {
      scale: 1
    },
    1: {
      scale:0.9
    }
  }

  const ArmorItem = ({activeItem,item,index}) => {
    if(item.$id == "empty0" || item.$id == "empty1"){
      return <View style={{ width: 100, height: 100, backgroundColor: 'transparent' }} />
    }
    return (
        <Animatable.View
          className='mr-5'
          animation={activeItem === item.$id || activeItem === index ? zoomIn : zoomOut}
          duration={500}
        >
           <TouchableOpacity className='justify-center items-center' activeOpacity={0.7}
            onPress={() => setShow(false)}
           >  
              <View className='ml-2'>{getIcon(item.icon,"#FF9001",80)}</View>
           </TouchableOpacity>
        </Animatable.View>
    )
  }
  const viewableItemsChanged = ({viewableItems}) => {
    if(viewableItems.length > 0){
      console.log(viewableItems[0].index);
      if(viewableItems[0].index < 1){
        setActiveItem(1);
      }
      else if(viewableItems[0].index >= types.hat.length){
        setActiveItem(types.hat.length-1);
      }
      else{
        setActiveItem(viewableItems[0].index)
      }
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
      {show && (
        <View className='items-center justify-center'>
          <FlatList
            data={types.hat}
            keyExtractor={(item) => item.$id}
            renderItem={({item,index}) => (
              <ArmorItem activeItem={activeItem} item={item} index={index}/>
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 98
            }}
            contentOffset={{x: 100}}
            horizontal
            className='w-[60%]'
          />
        </View>
      )}
      <View className='mt-6 items-center justify-center'>
        <View className='border bg-white rounded-xl'>
            <TouchableOpacity
              className='w-20 h-20 items-center bg-orange-300 rounded-xl  justify-center'
              onPress={() => {setActiveItem(types.hat[0]); setShow(true)}}
            > 
              <FontAwesome5 name="hat-cowboy" size={40} color="#FF9001" />
            </TouchableOpacity>
        </View>
        <View className='border bg-white rounded-xl mt-3'>
            <TouchableOpacity
              className='w-20 h-20 items-center bg-orange-300 rounded-xl  justify-center'
            >
               <FontAwesome5 name="tshirt" size={40} color="#FF9001" />
            </TouchableOpacity>
        </View>
        <View className='border bg-white rounded-xl mt-3'>
            <TouchableOpacity
              className='w-20 h-20 items-center bg-orange-300 rounded-xl  justify-center'
            >
              <FontAwesome5 name="tshirt" size={40} color="#FF9001" />
            </TouchableOpacity>
        </View>
        <View className='border bg-white rounded-xl mt-3'>
            <TouchableOpacity
              className='w-20 h-20 items-center bg-orange-300 rounded-xl justify-center'
            >
              <FontAwesome5 name="tshirt" size={40} color="#FF9001" />
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default profile