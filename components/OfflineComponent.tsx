import { View, Text } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const OfflineComponent = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <MaterialIcons name="wifi-off" size={24} color="#444" />
        <Text style={{ marginLeft: 10 }}>No internet connection</Text>
    </View>
  )
}

export default OfflineComponent