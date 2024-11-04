import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link } from 'expo-router'
import zxcvbn from 'zxcvbn';


const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email : '',
    password: ''
  })
  const strength = zxcvbn(form.password).score;
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const getStrengthColor = () => {
    switch (strength) {
      case 0:
        return 'text-red-500';
      case 1:
        return 'text-orange-500';
      case 2:
        return 'text-yellow-500';
      case 3:
        return 'text-blue-500';
      case 4:
        return 'text-green-500';
      default:
        return 'text-gray-300';
    }
  };
  const submit = () => {

  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[85vh] px-4 my-6'>
            {/* Logo hiányzik */}
          <Text className='text-3xl text-white text-center font-psemibold'>Sign up to Roplan</Text>
          <FormField
            title = "Username"
            value = {form.username}
            handleChangeText = {(e) => setForm({
              ...form, username: e
            })}
            otherStyles = "mt-7"
          />
          <FormField
            title = "Email"
            value = {form.email}
            handleChangeText = {(e) => setForm({
              ...form, email: e
            })}
            otherStyles = "mt-7"
          />
           <FormField
            title = "Password"
            value = {form.password}
            handleChangeText = {(e) => setForm({
              ...form, password: e
            })}
            otherStyles = "mt-7"
          />
          <Text className={`mt-3 ml-2 font-psemibold ${getStrengthColor(strength)}`}>
              {strengthLabel[strength]}
          </Text>
          <CustomButton
            title = "Sign Up"
            handlePress={submit}
            containerStyles="mt-7"           
          />

          <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-center text-lg text-white font-pregular'>Already have an account?</Text>
              <Link href='/sign-in' className='text-blue-400 font-psemibold text-lg'>Sign in</Link>
          </View>
        </View>
      </ScrollView>  
    </SafeAreaView>
  )
}

export default Signup