import { View, Text, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
const Progressbar = ({title, level, color, current, max, text, styleText, styleContainer}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedValue, {
        toValue: current/max,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false,
    }).start();
  }, [current])

  const handle_text = () => {
      switch (text){
        case 'XP' : 
            return <FontAwesome6 name="diamond" size={18} color="aqua"/>         
        case 'HP' : 
            return <AntDesign name="heart" size={18} color="darkred"/>
        default:
          return "";
      } 
  }
 
  return (
    <View className={`${styleContainer}`}>
          <View className="h-8 w-full bg-gray-400 rounded-full overflow-hidden justify-center">
            <Animated.View
                style={{
                    width: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                  className={`h-full ${color} rounded`}
                />
            <Text className="absolute left-1/2 -translate-x-1/2 text-white font-plight text-xl">
                    {current} / {max} { handle_text(title)}                   
            </Text>
            <Text className="absolute right-4 text-white font-pbold text-xl">{title} {level}</Text>
          </View>
    </View>
  )
}

export default Progressbar