import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

interface CategoryProps {
  id: number;
  icon: string;
  label: string;
  name: string;
}

export default function CategoryCard(category: CategoryProps) {
  const router = useRouter()
  return (
    <View className='postHeader'>
      <TouchableOpacity  style={styles.postHeader} onPress={() => router.push({
                  pathname: '/book/categoryBooks', 
                  params: { category: category.name, categoryLabel: category.label }
                })}>
        <Entypo name="open-book" size={24} color="black" style={styles.icon} />
        <View>
            <Text style={styles.categoryName}>{category.label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  postHeader: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    paddingVertical: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  categoryName: {
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    transform: [{ rotate: '18deg' }],
  }
})
