import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const Offline = () => {
 const router = useRouter();
    
    return (
      <View style={styles.container}>
        <View>
          <Ionicons name="cloud-offline-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.text}>ইন্টারনেট নেই।</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/download')}>
            <Text style={styles.download}>
              <Text>ডাউনলোড করা বইগুলো পড়ুন</Text>
              <Text>
                <Entypo name="arrow-bold-right" size={20} color="seashell" />
              </Text>
            </Text>
        </TouchableOpacity>
      </View>
    )
}

export default Offline

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 50,
    textAlign: 'center'
  },
  text: {
    fontSize: 20
  },
  download: {
    padding: 5, 
    backgroundColor: 'darkblue', 
    color: 'seashell',
    height: 40,
    width: 300,
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 18,
    borderRadius: 5,
  },
})