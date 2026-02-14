import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useFetch from '@/services/useFetch'
import { fetchCategories } from '@/services/api'
import CategoryCard from '@/components/CategoryCard'
import { useCategoryStore } from '../store/categories'
import { labels } from '../utils/labels'
import { useNavigation } from 'expo-router'

const category = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const { data: categories, loading: categoriesLoading, error: booksError } = useFetch(() => fetchCategories())

  const navigation = useNavigation();
  useLayoutEffect(() => {
    // Set the header title for the download screen
    navigation.setOptions({
      headerLeft: () => (<></>),
      title: labels.categories,
      headerTitleAlign: 'center',
        headerStyle: {
            height: 100,
            backgroundColor: '#085a80',
        },
        headerTintColor: '#d4d4d4',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
        headerRight: () => (<></>),
    });
  }, [])
  
  return (
    <View style={styles.container}>
      {
      categoriesLoading 
        ? <ActivityIndicator size="large" color="#0000ff" className='mt-10 self-center' />
        : (
          <>
            {setCategories(categories)}
            <FlatList
              data={categories}
              renderItem={({item}) => <CategoryCard {...item} /> }
              keyExtractor={(item) => item.id.toString()}
              style={styles.list}
            />
          </>
        )
      }
    </View>
  )
}

export default category

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray"
  },
  list: {
    width: "100%"
  },
})