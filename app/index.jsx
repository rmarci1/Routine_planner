import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import "../global.css"
import CustomButton from '@/components/CustomButton'
import images from '@/constants/images'
import { Redirect, router } from 'expo-router'
import { useGlobalContext } from '@/context/GlobalProvider'
const advantage = [
  { id:'1', title: "- A well formed structure that will help you achieve your goals"},
  { id:'2', title: "- The addition of making it a game so maintining your habits becomes easier "},
  { id:'3', title: "- Large options to customize your experience"},
  { id:'4', title: "- Simple design to make it user friendly"}
]
const index = () => {
  const {isLoading, isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href="/home" />

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex-1'>
        <FlatList
          data={advantage}
          keyExtractor={(item) => item.id}
          renderItem={({item}) =>
            ( 
              <View className='pl-8'>
                  <Text className='text-white mt-2 font-pregular '>{item.title}</Text>
              </View>
           )}
          ListHeaderComponent={() => (
            <View>
              <Text className='text-3xl text-white mt-10 text-center font-psemibold'>Welcome to 
                           {/* Itt még kikéne találnom egy nevet */} Roplan!</Text>
            <View className='relative'>
              <Text className='text-lg text-white mt-5 text-center font-pregular'>
                Here you can explore the endless possibilites of creating your
                  <Text className='text-blue-400'> habits</Text></Text>
            </View>
              <Image
                source={images.running}
                resizeMode='cover'
                className='w-full h-[300px] mt-4 rounded-2xl'
              />
              <Text className='text-white mt-10 font-psemibold text-left text-lg pl-2'>This app will give you: </Text>
            </View>
           )}
           ListFooterComponent={() => (
            <View className='my-8'>
              <Text className='text-white text-center font-pregular text-2xl'>What are you waiting for?</Text>
              <CustomButton
                title = "Let's start"
                handlePress= {() => router.push('/sign-in')}
                containerStyles = "w-full mt-5"
              />
          </View>
           )}
        />
        
      </View>
    </SafeAreaView>
  )
}

export default index