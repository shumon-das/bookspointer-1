import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';

interface CategoryProps {
  id: number;
  icon: string;
  label: string;
  name: string;
}

export default function CategoryCard(category: CategoryProps) {
  const router = useRouter()
  return (
    <View className='postHeader' style={styles.postHeader}>
      <TouchableOpacity  style={styles.postHeader} onPress={() => router.push({
                  pathname: '/book/categoryBooks', 
                  params: { category: category.name, categoryLabel: category.label }
                })}>
        <Icon name='file'></Icon>
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
    paddingVertical: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  image: {
    width: 40, // Image width
    height: 40, // Image height
    borderRadius: 25, // Makes it circular
    marginLeft: 12,
    marginRight: 10, // Space between image and text
    paddingLeft: 16
  },
  categoryName: {
    fontSize: 16,
    marginLeft: 10,
  },
})
