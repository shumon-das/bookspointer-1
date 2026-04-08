import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { User } from '@/components/types/User'
import labels from '@/app/utils/labels'
import englishNumberToBengali from '@/app/utils/englishNumberToBengali'
import { styles } from '@/styles/seriesList.styles'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/app/store/userStore'

const SeriesList = ({author, isUser, onPressCreateSeries}:{author: User|null, isUser?: boolean, onPressCreateSeries: (value: boolean) => void}) => {
  const router = useRouter()
  const authUserUuid = useUserStore((state) => state.authUser?.uuid);
  const series = author?.series ?? [];
  const canCreateSeries = !!authUserUuid && authUserUuid === author?.uuid;
  
  const renderItem = (index: number) => {
    return <View style={styles.series} key={index}>
      <Text style={styles.text}>{series[index].name}</Text>
      <Text style={styles.count}>
        {0 === index ? labels.allBooks : englishNumberToBengali(series[index].count) +' '+ labels.book}
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
      {canCreateSeries && <TouchableOpacity style={styles.series} onPress={() => onPressCreateSeries(true)}>
        <Text style={styles.text}>{labels.createNewSeries}</Text>
        <View style={styles.viewSeries}>
            <Text style={styles.viewSeriesText}>{labels.createNewSeries}</Text>
        </View>
      </TouchableOpacity>} 
      {series.map((_: any, i: number) => renderItem(i))}
    </View>
  )
}

export default SeriesList
