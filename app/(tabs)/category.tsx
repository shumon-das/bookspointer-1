import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import React from 'react'
import useFetch from '@/services/useFetch'
import { fetchCategories } from '@/services/api'
import CategoryCard from '@/components/CategoryCard'
import { useCategoryStore } from '../store/categories'

const category = () => {
  const setCategories = useCategoryStore((state) => state.setCategories)
  const { data: categories, loading: categoriesLoading, error: booksError } = useFetch(() => fetchCategories())
  
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