import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import "../global.css"
const FullyCustomButton = ({title, handlePress, containerStyles,textStyles,isLoading}) => {
  return (
    <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`rounded-lg justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
        disabled = {isLoading}
    >
        <Text className={`${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default FullyCustomButton