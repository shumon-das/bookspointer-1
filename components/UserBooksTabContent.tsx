import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { fetchBooksBySeriesName } from '@/services/profileApi';
import ProfileBookCard from './ProfileBookCard';

interface UserBooksTabContentProps {
    tabname: string;
    series: {seriesName: string}[],
    authorId: number,
    isLibrary: boolean,
    isCreator: boolean,
}

const UserBooksTabContent = ({ tabname, series, authorId, isLibrary, isCreator }: UserBooksTabContentProps) => {
    const [selectedSeries, setSelectedSeries] = useState(null as string | null)
    const [loading, setLoading] = useState(false)
    const [seriesBooks, setSeriesBooks] = useState([] as Book[])

    useEffect(() => {
        const backAction = () => {
            setSelectedSeries(null);
            return true;
        }
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => backHandler.remove(); // cleanup on unmount
    }, [])

    const fetchSeriesBooks = async (seriesName: string) => {
        setSelectedSeries(seriesName)
        setLoading(true)
        const books = await fetchBooksBySeriesName(seriesName, authorId, isLibrary, isCreator)
        setSeriesBooks(books)
        setLoading(false)
    }
    
  return (
    <View style={styles.seriesContainer} key={tabname}>
        { !selectedSeries
            ? 
                series.map((s, i) => (
                    <TouchableOpacity key={i} onPress={() => fetchSeriesBooks(s.seriesName)} 
                    >
                        <View style={styles.seriesStyle} key={s.seriesName}>
                            <Text style={styles.seriesNameColor}>{s.seriesName}</Text>
                        </View>  
                    </TouchableOpacity>
                ))
            : (
                loading 
                    ? <ActivityIndicator></ActivityIndicator> 
                    : seriesBooks.map((book: Book, index) => <ProfileBookCard key={index} {...book} />)
            )
        }
    </View>
  )
}

export default UserBooksTabContent

const styles = StyleSheet.create({
    seriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        padding: 10,
        justifyContent: 'center',
    },
    seriesStyle: {
        width: 105,
        height: 80,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#085a80',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    seriesNameColor: { 
        color: 'lightgray',
        fontSize: 16,
    }
})