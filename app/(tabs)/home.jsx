import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getCurrentProfile } from '@/lib/appwrite'

const home = () => {
  const {user,profile,setProfile} = useGlobalContext();
  console.log(user.$id)
 
  return (
    <SafeAreaView>
      <View className='bg-primary h-full'>
        <View className='my-6 px-4 space-y-6'>
          <View className=''>
          <Text className='text-gray-100 text-lg font-medium'>
              Welcome Back
          </Text>
          <Text className='text-2xl font-psemibold text-white'>
            {user?.username}
          </Text>
          <Text className='text-2xl font-psemibold text-white'>
            {profile?.coin}
          </Text>
          </View>
        </View>
      </View>
    <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </SafeAreaView>

  )
}

export default home