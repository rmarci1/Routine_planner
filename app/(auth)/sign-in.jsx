import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '@/lib/appwrite'
import CheckBox from '@react-native-community/checkbox';
const Signin = () => {
  const [form, setForm] = useState({
    email : '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const submit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields')
    }
    setisSubmitting(true);
    try {   
      const result = await signIn(form.email, form.password);
      router.replace('/(tabs)/home');
    }
    catch(error)
    {
      Alert.alert('Error',error.message);
    }
    finally{
      setisSubmitting(false);
    }

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
           <CheckBox
            value={isChecked}
            onValueChange={setIsChecked}
            tintColors={{ true: '#4CAF50', false: '#444' }}
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