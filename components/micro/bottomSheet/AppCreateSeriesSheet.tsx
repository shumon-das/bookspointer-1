import labels from '@/app/utils/labels';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { forwardRef, useMemo, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { User } from '../../types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '@/app/utils/config';
import { customDateTime } from '@/helper/customDateTime';
import { styles } from '@/styles/createSeries.styles';

const AppCreateSeriesSheet = forwardRef((author: User, ref: any) => {
  const snapPoints = useMemo(() => ['70%', '90%'], []);
  const [seriesText, setSeriesText] = useState('')
  const [seriesList, setSeriesList] = useState(author.series)
  const [isEdit, setIsEdit] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)

  const createOrEditSeries = async () => {
    if (seriesList.find((s: any) => s.name === seriesText)) {
      console.log('already exists')
      return;
    }

    if (seriesText.length > 0) {
      let value = author.series.length;
      const newValueNumber = seriesList.find((s: any) => s.name === value)
      if (newValueNumber) {
        value++
      }
      seriesList.push({value: `${value}`, name: seriesText, createdAt: customDateTime(), url: ''})
    }

    if (editItem && seriesText.length > 0) {
      setIsEdit(true)
      setSeriesText(editItem.name)
      const index = author.series.findIndex((s: any) => s.name === editItem.name)
      if (index !== -1) {
        author.series[index].name = seriesText
      }
    }
    
    const storageUser = await AsyncStorage.getItem('auth-user');
    const user = storageUser ? JSON.parse(storageUser) : null;
    const token = await AsyncStorage.getItem('auth-token');
    if (!token || !user) return;

    try {
      author.series = seriesList
      console.log(author.series.map((s: any) => s.name), seriesList.map((s: any) => s.name))
      const url = `${API_CONFIG.BASE_URL}/admin/update-user`;
      const response = await fetch(url, {
          method: 'POST',
          headers: {"Authorization": `Bearer ${token}`},
          body: JSON.stringify(author),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error Response:", errorText);
        return;
      }
      
      const data = await response.json()
      user.series = data.user.series
      AsyncStorage.setItem('auth-user', JSON.stringify(user))
      setSeriesList(data.user.series)
      setIsEdit(false)
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  const onEditSeries = async (item: any) => {
    setIsEdit(true)
    setSeriesText(item.name)
    setEditItem(item)
  }

  const deleteSeries = async (item: any) => {
    Alert.alert(labels.deleteItem.areYouSure, labels.deleteItem.deleteMessage, [
      {text: 'Yes', style: 'destructive', onPress: () => {
        setSeriesList(seriesList.filter((s: any) => s.name !== item.name))
        createOrEditSeries()
      }},
      {text: 'No', style: 'cancel'}
    ])
  }

  const Item = ({ item }: any) => {
    return (<View style={styles.item}>
      <Text style={{}}>{item.name}</Text>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={() => onEditSeries(item)}>
          <Text style={{color: 'blue'}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteSeries(item)}>
          <Text style={{color: 'red'}}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>)
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
        data={seriesList}
        keyExtractor={(item) => item.name.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 10 }}>
            <View style={styles.sheetHeader}>
              <TextInput
                style={styles.sheetInput}
                onChangeText={(text) => setSeriesText(text)}
                value={seriesText}
                placeholder={labels.createNewSeries}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.addButton} onPress={() => createOrEditSeries()}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>{isEdit ? '✓' : '+'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <Item item={item} />}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </BottomSheet>
  );
});

export default AppCreateSeriesSheet;
