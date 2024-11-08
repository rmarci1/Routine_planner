import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Animated, Easing } from 'react-native';

const PasswordStrength = () => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const calculateStrength = (input) => {
    let score = 0;
    if (input.length >= 6) score += 0.25; // Length check
    if (/[A-Z]/.test(input)) score += 0.25; // Uppercase letter
    if (/[0-9]/.test(input)) score += 0.25; // Numeric character
    if (/[^A-Za-z0-9]/.test(input)) score += 0.25; // Special character
    return score;
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const strengthScore = calculateStrength(text);
    setStrength(strengthScore);

    // Animate the progress bar width based on strength score
    Animated.timing(animatedValue, {
      toValue: strengthScore,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const progressColor = strength < 0.5 ? 'bg-red-500' : strength < 0.75 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <View className="p-5">
    <TextInput
      className="h-12 border border-gray-300 mb-4 px-3 rounded"
      placeholder="Enter your password"
      secureTextEntry={true}
      onChangeText={handlePasswordChange}
      value={password}
    />
    <View className="h-2 w-full bg-gray-300 rounded overflow-hidden">
      <Animated.View
        style={{
          width: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
        className={`h-full ${progressColor} rounded`}
      />
    </View>
    <Text className="text-lg font-bold text-center mt-3">
      {strength < 0.5 ? 'Weak' : strength < 0.75 ? 'Medium' : 'Strong'}
    </Text>
  </View>
  );
}

