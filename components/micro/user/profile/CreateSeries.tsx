import labels from '@/app/utils/labels'
import { customDateTime } from '@/helper/customDateTime'
import { createAndUpdateSeries } from '@/services/profileApi'
import { styles } from '@/styles/userSeries.styles'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { TextInput } from 'react-native-paper';

const CreateSeries = ({user, onChange, onBack}: {user: any, onChange: (value: any) => void, onBack:(value: boolean) => void}) => {
    const [data, setData] = useState(user.series.reverse())
    const [newSeriesName, setNewSeriesName] = useState('')

    const create = async () => {
        if ('' === newSeriesName || newSeriesName.length <= 0) return;

        if (data.find((s: any) => s.name === newSeriesName)) {
          Alert.alert(labels.sorry, labels.seriesExists)
          return;
        }
    
        const newItem = {value: `${data.length}`, name: newSeriesName, createdAt: customDateTime(), url: ''};
        const newSerieses = [...data, newItem]
        user.series = newSerieses;
        const response = await createAndUpdateSeries(user)

        if (response.user) {
          setData(response.user.series.reverse())
          setNewSeriesName('')
          await AsyncStorage.setItem('auth-user', JSON.stringify(response.user));
          onChange(response.user.series)
        }
    }
    
    const deleteSeries = async (item: any) => {
        Alert.alert(
          "Are you sure?",
          "Do you want to delete this item?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: async () => {
              const newItems = data.filter((series: any) => item.name !== series.name);
              user.series = newItems;
              const response = await createAndUpdateSeries(user)

              if (response.status) {
                setData(response.user.series.reverse())
                await AsyncStorage.removeItem('auth-user');
                await AsyncStorage.setItem('auth-user', JSON.stringify(response.user));
                onChange(response.user.series)
              }
            }}
          ]
        );
    }
    return (<View>
        <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 10}}>
          <TextInput
              style={{height: 18, width: '90%'}}
              onChangeText={(event) => setNewSeriesName(event)}
              value={newSeriesName}
              placeholder={labels.newSeries}
          />
          <TouchableOpacity onPress={create} style={{borderWidth: 1, borderColor: 'lightgray'}}>
            <MaterialIcons name="add-box" size={40} color="black" />
          </TouchableOpacity>

        </View>
        {Object.keys(data).map((i: any) => (
          <View key={i} style={styles.seriesListItem}>
            <View>
              <Text style={{color: 'white', marginHorizontal: 10}}>{data[i].name}</Text>
            </View>

            <View style={{marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableOpacity onPress={() => deleteSeries(data[i])}>
                <Text style={{ color: 'white', marginHorizontal: 10}}><MaterialIcons name="delete-forever" size={24} color="white" /></Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={() => onBack(false)}>
          <Text style={styles.seriesBackButton}>Back</Text>
        </TouchableOpacity>

        <View style={{height: 100}}></View>
      </View>)
}

export default CreateSeries