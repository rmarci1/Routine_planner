import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import "../global.css"


const index = () => {
  return (
    <SafeAreaView className='bg-primary'>
        <ScrollView>
            <Text className='text-3xl items-center'>asd</Text>
        </ScrollView>
    </SafeAreaView>
  )
}

export default index