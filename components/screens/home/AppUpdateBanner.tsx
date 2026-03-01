import { View, Text, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { useHomeStore } from '@/app/store/homeStore'
import labels from '@/app/utils/labels'

const AppUpdateBanner = () => {
  return (
    <View style={{height: 100, margin: 5, backgroundColor: '#085a80', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
        <Text style={{color: 'white', margin: 5, width: '70%', textAlign: 'center'}}>{useHomeStore.getState().bannerMessage ? useHomeStore.getState().bannerMessage : labels.versionUpdate}</Text>
        <TouchableOpacity style={{backgroundColor: 'white', padding: 5, borderRadius: 5}} onPress={() => 
        Linking.openURL('https://play.google.com/store/apps/details?id=com.monoranjan.bookspointer')
        }>
        <Text style={{color: '#085a80'}}>Update</Text>
        </TouchableOpacity>
    </View>
  )
}

export default AppUpdateBanner