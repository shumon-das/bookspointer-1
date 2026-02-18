import useCacheStore from '@/app/store/search';
import labels from '@/app/utils/labels';
import { searchAuthorData } from '@/services/searchapi';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User } from '../../types/User';

interface SearchItem {
  id: number;
  uuid: string;
  title: string;
  fullName: string;
  category: string
}
const AppBottomSheet = forwardRef((author: User, ref: any) => {
  const snapPoints = useMemo(() => ['70%', '90%'], []);
  const [searchText, setSearchText] = useState('')
  const [data, setData] = useState([] as SearchItem[])
  const router = useRouter();

  const cache = useCacheStore((state) => state.cache)
  const hasInCache = useCacheStore((state) => state.hasInCache)
  const setInCache = useCacheStore((state) => state.setInCache)
  const getFromCache = useCacheStore((state) => state.getFromCache)
  const handleSearch = async (text: string) => {
    setSearchText(text)
    if (!hasInCache(text.trim())) {
      if (text.trim().length < 2) return;
      const result = await searchAuthorData(text, author.id);
      setData(result)
      setInCache(text.trim(), result)
      return
    }
    setData(getFromCache(text.trim()))
  }

  const Item = ({ searchItem }: { searchItem: SearchItem }) => (
    <View style={styles.searchItem}>
      <Text style={styles.searchItemText}>{searchItem.title}</Text>
      <Text style={styles.searchItemAuthor}>{author.fullName}</Text>
    </View>
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: 'white' }}
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.text}>{author.fullName}</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleSearch}
              value={searchText}
              placeholder={labels.search}
              placeholderTextColor="#999"
            />
          </View>
        }

        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            router.push({
              pathname: "/screens/book/details",
              params: { id: item.id, title: item.title, author: item.fullName }
            })
          }}>
            <Item searchItem={item} />
          </TouchableOpacity>
        )}

        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '90%',
    borderRadius: 50,
    paddingHorizontal: 20,
    marginHorizontal: 'auto',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  searchItem: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  searchItemText: {
    paddingBottom: 3,
    fontSize: 15,
    fontWeight: '600'
  },
  searchItemAuthor: {
    fontSize: 12,
    color: 'gray'
  }
});

export default AppBottomSheet;