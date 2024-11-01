import React from 'react'
import {SplashScreen, Stack } from 'expo-router'

const Rootlayout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
    </Stack>
  )
}

export default Rootlayout