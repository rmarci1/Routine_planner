import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';

const Progressbar = ({ title, level, color, current,change, max, text, styleText, styleContainer,profile,handleclick,stat,spentPoints }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  if(change){
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: current / max,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }, [current, max, animatedValue]);

  }
  else{
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: current / max,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }, [current, max, animatedValue]);
  }
  // Memoize the icon rendering logic
  const memoizedIcon = useMemo(() => {
    switch (text) {
      case 'XP':
        return <FontAwesome6 name="diamond" size={18} color="aqua" />;
      case 'HP':
        return <AntDesign name="heart" size={18} color="darkred" />;
      default:
        return null;
    }
  }, [text]);

  // Memoize the animated style
  const animatedStyle = useMemo(() => {
    return {
      width: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    };
  }, [animatedValue]);

  return (
    <View className={`${styleContainer}`}>
      <View className="h-8 w-full bg-gray-400 rounded-full overflow-hidden justify-center">
        <Animated.View
          style={animatedStyle}
          className={`h-full ${change ? "bg-cyan-300" : color} rounded justify-center`}
        >
        {
          change && 
          ( 
            <AntDesign name="doubleright" size={20} color="lime" className='text-right mr-2' />
          )
        }
        </Animated.View>
        <Text className="absolute left-1/2 -translate-x-1/2 text-white font-plight text-xl">
          {current} / {max} {memoizedIcon}
        </Text>
        <Text className="absolute left-4 text-white font-pbold text-xl">
          {title} {level}
        </Text>
        {
          profile && (
            <View className='absolute right-3 flex-row items-center'>
              {spentPoints > 0 && <Text className='text-xl font-pbold text-secondary-200 mr-2'>+{spentPoints}</Text>}
              {spentPoints != 0 &&  <TouchableOpacity
                onPress={() => handleclick("minus",stat)}
                className='border border-white bg-white mr-2 rounded-lg'
              >
                <AntDesign name="minus" size={20} color="black" className=''/>
              </TouchableOpacity>}

              <TouchableOpacity
                onPress={() => (handleclick("plus",stat))}
                className='border border-white bg-white mr-2 rounded-lg'
              >
                 <AntDesign name="plus" size={20} color="black" className=''/>
              </TouchableOpacity>
              
            </View>
          )
        }
       
      </View>
    </View>
  );
};

export default React.memo(Progressbar);
