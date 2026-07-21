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
  // The profile can initially be hydrated from a book card's lightweight
  // createdBy object, before the full user response supplies `series`.
  const series = author?.series ?? [];
  const canCreateSeries = !!authUserUuid && authUserUuid === author?.uuid;
  
  const renderItem = (index: number) => {
    const item = series[index] ?? {};
    const seriesName = item.name ?? item.seriesName ?? labels.allBooks;
    const bookCount = item.count ?? item.bookCount ?? item.totalBooks ?? 0;

    return <View style={styles.series} key={index}>
      <Text style={styles.text}>{seriesName}</Text>
      <Text style={styles.count}>
        {englishNumberToBengali(bookCount)} {labels.book}
      </Text>
      <TouchableOpacity style={styles.viewSeries} onPress={() => author && router.push({
          pathname: isUser ? '/screens/user/user-series' : '/screens/author/author-series', 
          params: {authorUuid: author.uuid, url: author.url, series: seriesName}
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
