import labels from '@/app/utils/labels';
import { searchAuthorData } from '@/services/searchapi';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { forwardRef, useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User } from '../../types/User';
import { FontAwesome } from '@expo/vector-icons';
import { useBooksStore } from '@/app/store/bookStore';
import { styles } from '@/styles/appBottomSheet.styles';
import { useUserStore } from '@/app/store/userStore';

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
  const bookStore = useBooksStore();
  const isAuthor = author.id === useUserStore.getState().authUser?.id;

  const handleSearch = async (text: string) => {
    setSearchText(text)
    if (text.trim().length < 2) return;
    const result = await searchAuthorData(text, author.id);
    setData(result)
    return
  }

  const handleDeleteItem = (book: SearchItem) => {
    Alert.alert(
        book.title, // Title
        "Are you sure you want to permanently delete this book?", // Message
        [
        {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel" // On iOS, this makes the text bold
        },
        { 
            text: "OK", 
            onPress: () => bookStore.deleteBook(book.id as any),
        }
        ]
    );
  }

  const Item = ({ searchItem }: { searchItem: SearchItem }) => {
    return (<View>
        <View style={styles.searchItem}>
          <TouchableOpacity onPress={() => {
            router.push({
              pathname: "/screens/book/details",
              params: { id: searchItem.id, title: searchItem.title, author: searchItem.fullName }
            })
          }} style={{width: '80%'}}>
            <Text style={styles.searchItemText}>{searchItem.title}</Text>
            <Text style={styles.searchItemAuthor}>{author.fullName}</Text>
          </TouchableOpacity>
          
          {isAuthor && <View style={styles.searchItemActions}>
            <TouchableOpacity style={styles.searchItemAction} onPress={() => {
              router.push({pathname: "/screens/book/write-book", params: { bookuuid: searchItem.uuid, id: searchItem.id }})
            }}>
              <FontAwesome name="edit" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.searchItemAction} onPress={() => handleDeleteItem(searchItem)}>
              <FontAwesome name="trash" size={18} color="black" />
            </TouchableOpacity>
          </View>}
        </View>
      </View>  
    )
  };

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
        renderItem={({ item }) => <Item searchItem={item} />}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </BottomSheet>
  );
});

export default AppBottomSheet;