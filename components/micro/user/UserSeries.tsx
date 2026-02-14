import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import labels from '@/app/utils/labels';
import { styles } from '@/styles/userSeries.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateSeries from './profile/CreateSeries';

const UserSeries = ({series, author, onChooseSeries}: {series: any[], author: any, onChooseSeries: (value: string) => void}) => {
  const [isSeries, setIsSeries] = useState(false)
  const [user, setUser] = useState(null as any)
  const [data, setData] = useState(series)

  useEffect(() => {
      const loadLoggedInUser = async () => {
          const storedUser = await AsyncStorage.getItem('auth-user');
          setUser(storedUser ? JSON.parse(storedUser) : null);
      }

      loadLoggedInUser()
  }, [author])

  return (
    <ScrollView style={{ paddingHorizontal: 5, flex: 1, marginTop: 10 }}>
      {!isSeries && <View style={styles.grid}>
         {user && author && user.id === author.id && <TouchableOpacity style={[styles.series, {backgroundColor: '#2a52be',}]} onPress={() => setIsSeries(true)}>
            <MaterialIcons name="create-new-folder" size={24} color="white" />
            <Text style={[styles.seriesName, {fontSize: 12}]}>{labels.createNewSeries}</Text>
         </TouchableOpacity>}

        {Object.keys(data).map((i: any) => (
          <TouchableOpacity key={i} style={styles.series} onPress={() => onChooseSeries(data[i].name)}>
            <Text style={styles.seriesName}>{data[i].name}</Text>
          </TouchableOpacity>
        ))}
      </View>}

      {isSeries && <CreateSeries user={user} onChange={(value) => setData(value)} onBack={(value: boolean) => setIsSeries(value)} />}
      
    </ScrollView>
  )
}

export default UserSeries
