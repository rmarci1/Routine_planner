import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import FormField from '@/components/FormField'
const Signin = () => {
  const [form, setForm] = useState({
    email : '',
    password: ''
  })
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center px-4 my-6'>
            {/* Logo hiányzik */}
          <Text className='text-2xl text-white'>Log in to Roplan</Text>
          <FormField
            title = "Email"
            value = {form.email}
            handleChangeText = {(e) => setForm({
              ...form, email: e
            })}
            otherStyles = "mt-7"
          />
        </View>
      </ScrollView>  
    </SafeAreaView>
  )
}

export default Signin