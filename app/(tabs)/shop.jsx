import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome5,FontAwesome6 } from '@expo/vector-icons';

import { useGlobalContext } from '@/context/GlobalProvider'
import { getIcon } from '@/constants/icon';
import FullyCustomButton from '@/components/FullyCustomButton';
import { createProfileAccessories} from '@/lib/appwrite';

const shop = () => {
  const {profile,setProfile,defaultAccessories,setDefaultAccessories,accessories,setAccessories} = useGlobalContext();
  const [isModalVisible,setIsModalVisible] = useState(false);
  const [chosenItem, setChosenItem] = useState(null);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const handleBuy = () => {
    let accessory = accessories;
    accessory.push(chosenItem);
    setAccessories(accessory);
    createProfileAccessories(chosenItem.$id,profile.$id);
    setDefaultAccessories(defaultAccessories.filter((curr) => curr.$id != chosenItem.$id));
    toggleModal();
  }
  const handleConfirm = () => {
    Alert.alert("Confirm","Are you sure you want to buy this?",[
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Confirm",
        onPress: handleBuy,
      }
    ], {cancelable:false})
  }
  const renderItem = ({item}) => {
    return (
      <View className='items-center ml-10'>
        <TouchableOpacity
          onPress={() => {
            setChosenItem(item);
            setIsModalVisible(true);
          }}
        >
            <View className='flex-row justify-center'>
              <Text className='font-thin text-secondary-200 text-lg mr-2'>{item.price}</Text>
              <FontAwesome5 name="coins" size={16} color="orange"/>
            </View>
            <View className='justify-center'>
              <View className='ml-2'>{getIcon(item.icon,"#FF9001",30)}</View>
            </View>
        </TouchableOpacity>
      </View>
      )
  }
  const renderoneItem = (item) => {
  return (
    <View>
      <View className='items-center justify-center mt-3'>
          <Text className='font-plight text-white text-lg'>{chosenItem.name}</Text>
          <View className='ml-2'>{getIcon(chosenItem.icon,"#FF9001",50)}</View>
      </View>
      <View className='flex-row mt-4 justify-end'>
          <Text className='font-pthin text-secondary-200 text-lg mr-2'>Costs: <Text className='font-pbold'>{chosenItem.price}</Text></Text>
          <FontAwesome5 name="coins" size={16} color="orange"/>
        </View>
    </View>
  )
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <View>
        <View className='flex-row items-center justify-center mt-6'>
          <Text className='text-secondary-100 font-pregular text-3xl text-center'>Shop</Text>
          <FontAwesome6 name="shop" size={20} color="#FF8E01" className="ml-2 text-center"/>
        </View>
        <View className='flex-row items-center justify-end mt-2'>
          <FontAwesome5 name="gem" size={18} color="green" className="mr-1 mt-1" />
          <Text className='text-xl font-psemibold text-white text-right mr-4'>
            {profile?.diamond}
          </Text>
    
          <FontAwesome5 name="coins" size={18} color="orange" className="mr-1 mt-1" />
          <Text className='text-xl font-psemibold text-white'>
          {profile?.coin}
          </Text>
        </View>
      </View>
      <View className='mt-4'>
        <FlatList
          data={defaultAccessories}
          keyExtractor={(item,index) =>index.toString()}
          renderItem={renderItem}
          numColumns={6}
        />    
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-80 p-5 bg-primary rounded-xl">
            <View className='flex-row justify-between items-center'>
              <View className="flex-1 items-center">
                  <Text className="text-secondary-200 text-2xl font-pmedium ml-10">Buying</Text>
              </View>
              <FontAwesome5 name="coins" size={14} color="orange" className="mr-1" />
              <Text className="text-white text-sm font-pmedium">{profile?.coin}</Text>
            </View>
            <View>
              {chosenItem? (
                renderoneItem(chosenItem)
              ):(
                <View>
                </View>
              )}
            </View>
            <View className='justify-between flex-row mt-6'>
            <FullyCustomButton
              title="Close"
              handlePress={toggleModal}
              containerStyles="w-[35%] h-10 bg-purple-400"
              textStyles="text-xl text-white font-pregular"
            />
              <TouchableOpacity
                onPress={() => handleConfirm()}
                activeOpacity={0.7}
                className='h-10 w-[35%] bg-lime-500 rounded-lg justify-center items-center'
              > 
                <Text className='font-pregular text-white text-xl'>Buy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default shop