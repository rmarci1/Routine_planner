import { View, Text } from 'react-native'
import React from 'react'

import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useGlobalContext } from '@/context/GlobalProvider';
import CustomButton from './CustomButton';
import { router } from 'expo-router';
const EmptyState = ({state}) => {
    const {profile} = useGlobalContext();
    console.log(state)
    return (
        <View className='justify-center items-center mt-4'>
            {state && (
                <View className='w-[80%]'>
                <Text className='text-white font-pmedium text-xl text-center'>
                Good Job! <AntDesign name="star" size={18} color="yellow" />
                </Text>
                <Text className='text-white font-pmedium text-lg text-center mt-4'>You have completed all of your <Text className='color-blue-400'>tasks</Text> for today</Text>
                </View>
                )
            }
            {!state && (
                <View className='w-full'>
                    <Text className='text-white font-psemibold text-2xl text-center'>You have no <Text className='color-blue-400'>task </Text>yet<FontAwesome5 name="search" size={24} color="black" /></Text>
                    <Text className='text-white font-pregular text-2xl text-center mt-4'>Set up one!</Text>
                    <CustomButton
                        title = "Create task"
                        handlePress={() => router.push('/habits')}
                        containerStyles="mt-5"
                    />
                </View>
            ) }
        </View>
    )
}

export default EmptyState