import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const UserSeries = ({series, onChooseSeries}: {series: any[], onChooseSeries: (value: string) => void}) => {

  return (
    <ScrollView style={{ paddingHorizontal: 5, flex: 1, marginTop: 10 }}>
      <View style={styles.grid}>
        {Object.keys(series).map((i: any) => (
          <TouchableOpacity key={i} style={styles.series} onPress={() => onChooseSeries(series[i].name)}>
            <Text style={styles.seriesName}>{series[i].name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default UserSeries

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 50,
  },
  series: {
    width: '32%',
    marginBottom: 8,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#085a80',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seriesName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F6F7F9',
  },
})