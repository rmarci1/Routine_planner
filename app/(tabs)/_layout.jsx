import { View, Text } from 'react-native'
import React from 'react'
import {Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { StatusBar } from 'expo-status-bar';
const TabIcon = ({color,name,focused}) =>{
  return (
      <View className="items-center justify-center gap-2">
          {
            name === "Home" && (
              <Entypo name="home" size={26} color={color} />
            )
          }
          {
            name === "Shop" && (
              <FontAwesome6 name="shop" size={26} color={color} />
            )
          }
          {
            name === "Profile" && (
              <Feather name="user" size={26} color={color} />
            )
          }
            {
            name === "Habits" && (
              <FontAwesome5 name="tasks" size={26} color={color} />
            )
          }
          
          <Text className={`${focused? "font-psemibold": "font-pregular"} text-xs`} style={{color:color}}>
                {name}
          </Text>
      </View>
  )
}
const _layout = () => {
  return (  
    <>
    <Tabs
    screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor : '#60a5f6',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle: {
                backgroundColor: '#161622',
                borderTopWidth: 1,
                borderTopColor: '#232522',
                height: 84,
            }
        }}
    >
    <Tabs.Screen
      name='home'
      options={{
          title : 'Home',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Home"
                focused = {focused}
            />
        )
      }}
    />
     <Tabs.Screen
      name='habits'
      options={{
          title : 'Habits',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Habits"
                focused = {focused}
            />
        )
      }}
    />
    <Tabs.Screen
      name='profile'
      options={{
          title : 'Profile',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Profile"
                focused = {focused}
            />
        )
      }}
    />
    <Tabs.Screen
      name='shop'
      options={{
          title : 'Shop',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Shop"
                focused = {focused}
            />
        )
      }}
    />
    </Tabs>
    <StatusBar backgroundColor='#161622' style='light'></StatusBar>
    </> 
  )
}

export default _layout