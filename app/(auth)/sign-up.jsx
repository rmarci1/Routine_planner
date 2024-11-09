import { View, Text, ScrollView, Alert, Animated,Easing } from 'react-native'
import React, { useRef, useState } from 'react'
import "../../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import zxcvbn from 'zxcvbn';
import {createUser} from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'

const Signup = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext()
  const [form, setForm] = useState({
    username: '',
    email : '',
    password: '',
    next_password: ''
  })
  const strength = zxcvbn(form.password).score;
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  const animatedValue = useRef(new Animated.Value(2)).current;
 
  const getStrengthColor = () => {
    Animated.timing(animatedValue, {
      toValue: strength/4,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    switch (strength) {
      case 0:
        return 'text-red-500' ;    
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
  const getBgColor = () => {
      switch (strength) {
        case 0:
          return 'bg-red-500' ;    
        case 1:
          return 'bg-orange-500';
        case 2:
          return 'bg-yellow-500';
        case 3:
          return 'bg-blue-500';
        case 4:
          return 'bg-green-500';
        default:
          return 'bg-gray-300'; 
      }
  }
  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = async () => {
      if(!form.username || !form.email || !form.password){
        Alert.alert('Error', 'Please fill in all the fields')
        return;
      }
      if(form.password != form.next_password){
        Alert.alert('Error', 'Your passwords does not match')
        return;
      }
      if(strength < 3){
        Alert.alert('Error', 'Your password needs to be Strong')
        return;
      }
      setisSubmitting(true);

      try {
        const result = await createUser(form.email, form.password, form.username);
        setUser(result);
        setIsLoggedIn(true);

        router.replace('/sign-in');
      }
      catch (error){
        Alert.alert('Error', error.message);
        return;
      }
      finally{
        setisSubmitting(false);
      }
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[95vh] px-4 my-6'>
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
          <Text className={`mt-3 ml-2 font-psemibold text-xl ${getStrengthColor(strength)}`}>
              {strengthLabel[strength]}
          </Text>
            <View className="h-2 w-[98%] ml-2 bg-gray-300 rounded overflow-hidden">
            <Animated.View
               style={{
                  width: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }}
                className={`h-full ${getBgColor(strength)} rounded`}
              />
            </View>
           <FormField
            title = "Confirm Password"
            value = {form.next_password}
            handleChangeText = {(e) => setForm({
              ...form, next_password: e
            })}
            otherStyles = "mt-4"
          />
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