import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '@/components/types/User'
import labels from '@/app/utils/labels'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'
import { styles } from '@/styles/seriesList.styles'
import { useRouter } from 'expo-router'

const SeriesList = ({author, isUser, onPressCreateSeries}:{author: User|null, isUser?: boolean, onPressCreateSeries: (value: boolean) => void}) => {
  const [series, setSeries] = useState([] as any[])
  const router = useRouter()

  useEffect(() => {
    if (author && author.series) {
      setSeries(author.series)
    }
  }, [author])
  
  const renderItem = (index: number) => {
    return <View style={styles.series} key={index}>
      <Text style={styles.text}>{series[index].name}</Text>
      <Text style={styles.count}>
        {0 === index ? labels.allBooks : englishNumberToBengali(series[index].count) + ' টি বই'}
      </Text>
      <TouchableOpacity style={styles.viewSeries} onPress={() => author && router.push({
          pathname: isUser ? '/screens/user/user-series' : '/screens/author/author-series', 
          params: {authorUuid: author.uuid, url: author.url, series: series[index].name}
        })}>
        <Text style={styles.viewSeriesText}>{labels.visitSeries}</Text>
      </TouchableOpacity>
    </View>
  }

  return (
    <View style={styles.gridContainer}>
      <TouchableOpacity style={styles.series} onPress={() => onPressCreateSeries(true)}>
        <Text style={styles.text}>{'নতুন সিরিজ তৈরি করুন'}</Text>
        <View style={styles.viewSeries}>
            <Text style={styles.viewSeriesText}>{labels.createNewSeries}</Text>
        </View>
      </TouchableOpacity> 
      {Object.keys(series).map((s: any, i: number) => renderItem(i))}
    </View>
  )
}

export default SeriesList
