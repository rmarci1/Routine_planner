import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link } from 'expo-router'
const Signin = () => {
  const [form, setForm] = useState({
    email : '',
    password: ''
  })
  const submit = () => {

  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
            {/* Logo hiányzik */}
          <Text className='text-3xl text-white text-center font-psemibold'>Log in to Roplan</Text>
          <FormField
            title = "Email"
            value = {form.email}
            handleChangeText = {(e) => setForm({
              ...form, email: e
            })}
            placeholder="Enter your email..."
            otherStyles = "mt-7"
          />
           <FormField
            title = "Password"
            value = {form.password}
            handleChangeText = {(e) => setForm({
              ...form, password: e
            })}
            placeholder="Enter your password..."
            otherStyles = "mt-7"
          />
          <CustomButton
            title = "Sign In"
            handlePress={submit}
            containerStyles="mt-7"           
          />
          <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-center text-lg text-white font-pregular'>Don't have an account?</Text>
              <Link href='/sign-up' className='text-blue-400 font-psemibold text-lg'>Sign up</Link>
          </View>
        </View>
      </ScrollView>  
    </SafeAreaView>
  )
}

export default Signin