import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import "../global.css"

const CustomButton = ({title, handlePress, containerStyles,isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`bg-blue-400 rounded-3xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        disabled = {isLoading}
    >
        <Text className='text-white text-xl font-psemibold'>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton