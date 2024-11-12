import { View, Text, ScrollView, Alert} from 'react-native'
import React, { useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import CheckBox from 'expo-checkbox'
import { signIn,getCurrentUser,updateUser, getCurrentProfile } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
const Signin = () => {
  const {setUser, setIsLoggedIn,setProfile,setIsProfileIn} = useGlobalContext()
  const [form, setForm] = useState({
    email : '',
    password: ''
  })
  const [isSubmitting, setisSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false)

  const submit = async () => {
    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the fields')
      return;
    }
    setisSubmitting(true);
    try {   
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);
      await updateUser(result,isChecked)

      const profile = await getCurrentProfile();
      
      setProfile(profile);
      setIsProfileIn(true);
      router.replace('/(tabs)/home');

    }
    catch(error)
    { 
      Alert.alert('Error',error.message);
      return;
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
          <View className='flex-row pl-2 pt-7'>
            <CheckBox
              value = {isChecked}
              onValueChange={setIsChecked}
            />
            <Text className='text-lg text-white font-pregular pl-2'>Remember me</Text>
          </View>
          <CustomButton
            title = "Sign In"
            handlePress={submit}
            containerStyles="mt-7" 
            isLoading={isSubmitting}                  
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