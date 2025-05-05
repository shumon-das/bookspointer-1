import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const updateProfile = () => {
    const {userId, token} = useLocalSearchParams();
    const navigation = useNavigation()

    useLayoutEffect(() => {
      const title = "Reset Password"
      navigation.setOptions({ title }), [title]
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log('updateProfile')}>
            <FontAwesome name="gear" size={20} style={{paddingHorizontal: 15}} />
          </TouchableOpacity>
        ),
      })
    })
  return (
    <View>
      <Text>updateProfile</Text>
    </View>
  )
}

export default updateProfile