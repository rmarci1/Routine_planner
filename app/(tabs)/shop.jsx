import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalContext } from '@/context/GlobalProvider'
import { FontAwesome5,FontAwesome6 } from '@expo/vector-icons';
import { getIcon } from '@/constants/icon';
const shop = () => {
  const {profile,setProfile,accessories} = useGlobalContext();
  const [isModalVisible,setIsModalVisible] = useState(false);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
  const renderItem = ({item,index}) => (

      <View className='items-center mr-20'>
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
        >
            <View className='flex-row justify-center'>
              <Text className='font-thin text-secondary-200 text-lg mr-2'>{item.price}</Text>
              <FontAwesome5 name="coins" size={16} color="orange"/>
            </View>
            <View className='justify-center'>
              <View className='ml-2'>{getIcon(item.icon,"#FF9001",50)}</View>
              <Text className='font-plight text-white text-sm'>{item.name}</Text>
            </View>
        </TouchableOpacity>
      </View>
  )
  return (
    <SafeAreaView className='bg-primary h-full'>
      <View>
        <FlatList
          data={accessories}
          keyExtractor={(item,index) =>index.toString()}
          renderItem={renderItem}
          numColumns={4}
          ListHeaderComponent={
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
          }
        />
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-72 h-40 p-5 bg-primary rounded-xl items-center">
            <View className='flex-row justify-between items-center'>
              <View className="flex-1 items-center">
                  <Text className="text-secondary-200 text-2xl font-pmedium ml-10">Buying</Text>
              </View>
              <FontAwesome5 name="coins" size={14} color="orange" className="mr-1" />
              <Text className="text-white text-sm font-pmedium">{profile?.coin}</Text>
            </View>
            <TouchableOpacity onPress={toggleModal}>
              <Text className="text-blue-500">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </SafeAreaView>
  )
}

export default shop