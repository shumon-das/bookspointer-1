import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import labels from '@/app/utils/labels';
import { styles } from '@/styles/userSeries.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-paper';
import { customDateTime } from '@/helper/customDateTime';
import { createAndUpdateSeries } from '@/services/profileApi';

const UserSeries = ({series, author, onChooseSeries}: {series: any[], author: any, onChooseSeries: (value: string) => void}) => {
  const [isSeries, setIsSeries] = useState(false)
  const [user, setUser] = useState(null as any)
  const [token, setToken] = useState(null as string | null)
  const [newSeriesName, setNewSeriesName] = useState('')
  const [data, setData] = useState(series)

  useEffect(() => {
      const loadLoggedInUser = async () => {
          const token = await AsyncStorage.getItem('auth-token');
          setToken(token)
          const storedUser = await AsyncStorage.getItem('auth-user');
          setUser(storedUser ? JSON.parse(storedUser) : null);
      }

      loadLoggedInUser()
  }, [])

  const createSeries = async () => {
    if (!token) {
      Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
      return;
    }

    if (data.find((s) => s.name === newSeriesName)) {
      Alert.alert(labels.sorry, labels.seriesExists)
      return;
    }

    const newItem = {value: `${data.length}`, name: newSeriesName, createdAt: customDateTime(), url: ''};
    setData([...data, newItem])
    user.series = data;
    const response = await createAndUpdateSeries(user, token)
    if (response.user) {
      setNewSeriesName('')
      await AsyncStorage.setItem('auth-user', JSON.stringify(response.user));
    }
  }

  const deleteSeries = async (item: any) => {
    if (!token) {
      Alert.alert(labels.sorry, labels.pleaseLoginToContinue)
      return;
    }

    Alert.alert(
      "Are you sure?",
      "Do you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: async () => {
          const newItems = data.filter((series: any) => item.name !== series.name);
          user.series = newItems;
          const response = await createAndUpdateSeries(user, token)
          console.log(response.user.series)
          if (response.status) {
            setData(response.user.series)
            await AsyncStorage.setItem('auth-user', JSON.stringify(response.user));
          }
        }}
      ]
    );
  }

  return (
    <ScrollView style={{ paddingHorizontal: 5, flex: 1, marginTop: 10 }}>
      {!isSeries && <View style={styles.grid}>
         {user && user.id === author.id && <TouchableOpacity style={[styles.series, {backgroundColor: '#2a52be',}]} onPress={() => setIsSeries(true)}>
            <MaterialIcons name="create-new-folder" size={24} color="white" />
            <Text style={[styles.seriesName, {fontSize: 12}]}>{labels.createNewSeries}</Text>
         </TouchableOpacity>}

        {Object.keys(data).map((i: any) => (
          <TouchableOpacity key={i} style={styles.series} onPress={() => onChooseSeries(data[i].name)}>
            <Text style={styles.seriesName}>{data[i].name}</Text>
          </TouchableOpacity>
        ))}
      </View>}
      
      {isSeries && <View>
        <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 10}}>
          <TextInput
              style={{height: 18, width: '90%'}}
              onChangeText={(event) => setNewSeriesName(event)}
              value={newSeriesName}
              placeholder={labels.newSeries}
          />
          <TouchableOpacity onPress={createSeries} style={{borderWidth: 1, borderColor: 'lightgray'}}>
            <MaterialIcons name="add-box" size={40} color="black" />
          </TouchableOpacity>

        </View>
        {Object.keys(data.reverse()).map((i: any) => (
          <View key={i} style={styles.seriesListItem}>
            <View>
              <Text style={{color: 'white', marginHorizontal: 10}}>{data[i].name}</Text>
            </View>

            <View style={{marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={() => deleteSeries(series[i])}>
                <Text style={{ color: 'white', marginHorizontal: 10}}><MaterialIcons name="delete-forever" size={24} color="white" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={() => setIsSeries(false)}>
          <Text style={styles.seriesBackButton}>Back</Text>
        </TouchableOpacity>
      </View>}
    </ScrollView>
  )
}

export default UserSeries
