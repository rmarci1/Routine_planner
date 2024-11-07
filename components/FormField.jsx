import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';


const FormField = ({title,value,handleChangeText,otherStyles,placeholder}) => {
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-white text-2xl font-pmedium pl-2 pb-3'>{title}</Text>
      <View className='border-2 border-blue-400 w-full h-16 px-4 bg-black-100 rounded-3xl focus:border-x-lime-400 items-center flex-row pt-4'>
        <TextInput
          className='text-white font-psemibold text-lg flex-1 pb-3'
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry = {title === 'Password' && !showPassword}
        />
        {
          title === 'Password' && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {
                    !showPassword ? (
                       <Entypo name="eye-with-line" size={20}  color="white" className='w-6 h-6 mr-2 mb-3'/>
                    ):(
                      <AntDesign name="eye" size={20} color="white" className='w-6 h-6 mr-2 mb-3'/>
                    )
                  }
              </TouchableOpacity>
          )
        }
      </View>
    </View> 
  )
}

export default FormField