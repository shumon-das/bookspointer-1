import CategoryCard from '@/components/CategoryCard';
import SearchInput from '@/components/micro/SearchInput';
import { fetchCategories } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useCategoryStore } from '../store/categories';
import { useSystemStore } from '../store/systemStore';
import { useLabels } from '../utils/labels';

const Category = () => {
  const navigation = useNavigation();
  const lang = useSystemStore((state) => state.lang);
  const labels = useLabels();
  const setCategories = useCategoryStore((state) => state.setCategories);
  const { data: categories, loading: categoriesLoading } = useFetch(() => fetchCategories());
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [isFilterNotFound, setIsFilterNotFound] = useState(false);

  const categoryItems = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    setCategories(categoryItems);
  }, [categoryItems, setCategories]);

  const visibleCategories = isFilterNotFound
    ? []
    : filteredCategories.length > 0
      ? filteredCategories
      : categoryItems;

  return (
    <View style={styles.container}>
      <View style={styles.topBar} />
      <View style={styles.header}>
        <View style={styles.searchWrap}>
          <SearchInput
            items={categoryItems}
            filterField={lang === 'bn' ? 'label' : 'name'}
            onFiltered={setFilteredCategories}
            isNotFound={setIsFilterNotFound}
          />
        </View>
      </View>

      <FlatList
        data={visibleCategories}
        renderItem={({ item }) => <CategoryCard {...item} />}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={visibleCategories.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={
          categoriesLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="small" color="#085a80" />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{labels.noBooksFound}</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f0eb',
  },
  topBar: {
    width: '100%',
    height: 35,
    backgroundColor: 'dimgrey',
  },
  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f0eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrap: {
    width: '90%',
  },
  list: {
    width: '100%',
  },
  emptyList: {
    flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 28,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
