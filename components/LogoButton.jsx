import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
const LogoButton = ({logo,change}) => {

  return (
    <View className=''>
      <TouchableOpacity
        onPress={() => change()}
      > 
        {logo}
      </TouchableOpacity>
    </View>
  )
}

export default LogoButton