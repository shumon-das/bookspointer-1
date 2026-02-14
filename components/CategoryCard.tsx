import { englishNumberToBengali } from '@/app/utils/englishNumberToBengali';
import { labels } from '@/app/utils/labels';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryProps {
  totalBooksCount: number;
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
        <Entypo name="open-book" size={32} color="black" style={styles.icon} />
        <View>
            <Text style={styles.categoryName}>{category.label}</Text>
            <Text style={styles.categoryBookCount}>{englishNumberToBengali(category.totalBooksCount)} টি {labels.book}</Text>
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
  categoryBookCount: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
  },
  icon: {
    transform: [{ rotate: '18deg' }],
  }
})
