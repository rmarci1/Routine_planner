import { View, Text } from 'react-native'
import React from 'react'
import {Tabs } from 'expo-router'
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
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
            name === "Settings" && (
              <Feather name="settings" size={26} color={color}  />
            )
          }
          {
            name === "Profile" && (
              <Feather name="user" size={26} color={color} />
            )
          }
            {
            name === "Tasks" && (
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
      name='tasks'
      options={{
          title : 'Tasks',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Tasks"
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
      name='settings'
      options={{
          title : 'Settings',
          headerShown : false,
          tabBarIcon: ({color,focused}) => (
            <TabIcon
                color = {color}
                name = "Settings"
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