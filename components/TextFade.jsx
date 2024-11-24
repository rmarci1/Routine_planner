import React, { useState, useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

const TextFade = ({update}) => {
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // Trigger the animation when the component mounts
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50, // Move upwards by 50 units
        duration: 1500, // 2 seconds
        useNativeDriver: true, // Optimize for native performance
      }),
      Animated.timing(opacity, {
        toValue: 0, // Fade out
        duration: 1500, // Same duration as the upward animation
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animation done, update the state
      setIsAnimationDone(true);
    });
  }, [translateY, opacity]);

  if (isAnimationDone || update == 0) {
    return (
      <View>
      </View>
    );
  }
  return (
    <View className="flex-1 justify-center items-center flex-row">
      <Animated.Text
        className="text-xl font-bold text-white"
        style={{
          transform: [{ translateY }],
          opacity,
        }}
      >
        <FontAwesome6 name="diamond" size={18} color="aqua" /> {update} XP
        <FontAwesome5 name="coins" size={18} color="orange" className="ml-1 mt-1" /> {update}
      </Animated.Text>
    </View>
  );
};

export default TextFade;
