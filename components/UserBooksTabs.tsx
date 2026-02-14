import React, { useEffect, useState } from 'react'
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import UserBooksTabContent from './UserBooksTabContent';
import { labels } from '@/app/utils/labels';
import { authorBooks, userBooks } from '@/services/api';

interface Tab {
  name: string;
  label: string;
}

interface AuthorProps {
  authorId: number,
  isCreator: number,
}

const UserBooksTabs = ({authorId, isCreator} : AuthorProps) => {
  const tabs = [{name: 'Books', label: labels.userBookTypes.books}, {name: 'Library', label: labels.userBookTypes.library}]
  const [activeTab, setActiveTab] = useState('Books');
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState([] as {seriesName: string}[])
  const [librarySeries, setLibrarySeries] = useState([] as {seriesName: string}[])

  useEffect(() => {
    const fetchAuthorBooks = async () => {
      if (authorId) {
        setLoading(true)
        const data = await authorBooks(authorId, isCreator)
        setSeries(data.series)
        setLibrarySeries(data.librarySeries)
        setLoading(false)
      }
    }
    fetchAuthorBooks()
  }, [])

  
  const selectTabStyle = (tab: Tab) => {
    return {
      padding: 10, 
      borderBottomWidth: activeTab === tab.name ? 1 : 0,
      borderBottomColor: activeTab === tab.name ? 'blue' : '',
    }
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab.name} onPress={() => setActiveTab(tab.name)}>
            <Text style={selectTabStyle(tab)}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        { loading 
            ? <ActivityIndicator></ActivityIndicator>
            : (
                <View>
                  {activeTab === 'Books' && <UserBooksTabContent tabname={activeTab} series={series} authorId={authorId} isCreator={isCreator === 1} isLibrary={false} />}
                  {activeTab === 'Library' && <UserBooksTabContent tabname={activeTab} series={librarySeries} authorId={authorId} isCreator={isCreator === 1} isLibrary={true} />}
                </View>
            )
        }
    </View>

  )
}

export default UserBooksTabs