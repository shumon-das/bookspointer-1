import { useSystemStore } from '@/app/store/systemStore';
import { englishNumberToBengali } from '@/app/utils/englishNumberToBengali';
import { useLabels } from '@/app/utils/labels';
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
  totalEnBooksCount?: number;
  totalBnBooksCount?: number;
}

export default function CategoryCard(category: CategoryProps) {
  const router = useRouter()
  const lang = useSystemStore((state) => state.lang);
  const labels = useLabels();
    
  return (
    <View className='postHeader'>
      <TouchableOpacity  style={styles.postHeader} onPress={() => router.push({
                  pathname: '/book/categoryBooks', 
                  params: { category: category.name, categoryLabel: category[lang === 'bn' ? 'label' : 'name'] }
                })}>
        <Entypo name="open-book" size={32} color="black" style={styles.icon} />
        <View>
            <Text style={styles.categoryName}>{category[lang === 'bn' ? 'label' : 'name']}</Text>
            <Text style={styles.categoryBookCount}>{englishNumberToBengali(lang === 'en' ? category?.totalEnBooksCount ?? 0 : category?.totalBnBooksCount ?? 0)} {labels.book}</Text>
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
