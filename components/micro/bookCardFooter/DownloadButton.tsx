import { fullBook } from '@/services/api';
import { labels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { isBookDownloaded, saveEncryptedBook } from '@/helper/details';
import { createBookMetaTable, insertBookMeta } from '@/app/utils/database/bookMetaDb';


const DownloadButton = ({ bookId, title, author, uuid, onDownloaded, variant }: {bookId: number; title: string; author: string; uuid: string, onDownloaded: (isSave: Boolean) => void; variant?: 'feed'}) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const checkIsDownloaded = async () => {
      const downloaded = await isBookDownloaded(bookId)
      setDownloaded(downloaded);
    }

    checkIsDownloaded()
  }, [bookId])

  const onDownload = async () => {
    try {
      await createBookMetaTable()
      setLoading(true)
      const book = await fullBook(uuid);
      const downloadPath = await saveEncryptedBook(bookId, book.content);
      if (downloadPath) {
        const savedMeta = await insertBookMeta(bookId, book.uuid, book.title, book.author.fullName, book.category.label, 1, downloadPath);
      }
  
      setDownloaded(true)
      setLoading(false)
      onDownloaded(true);
    } catch (error) {
      console.log('Error creating book meta table:', error)
      setLoading(false)
    }
  };

  const renderIcon = () => {
    const feed = variant === 'feed';
    return <>
        {downloaded 
            ? <>
                <View style={feed ? { alignItems: 'center' } : undefined}><View style={feed ? { width: 30, height: 30, borderRadius: 10, backgroundColor: '#eaf0ff', alignItems: 'center', justifyContent: 'center' } : undefined}><FontAwesome name="download" size={14} color={'#5267d8'} /></View><Text style={{fontSize: 10, color: '#5267d8', fontWeight: feed ? '700' : undefined, marginTop: feed ? 3 : undefined}}>{labels.downloadedAlready}</Text></View>
              </>
            : (<>
                <TouchableOpacity onPress={onDownload} style={feed ? { alignItems: 'center' } : undefined}>
                  <View style={feed ? { width: 30, height: 30, borderRadius: 10, backgroundColor: '#eef2f7', alignItems: 'center', justifyContent: 'center' } : undefined}><FontAwesome name="download" size={14} color={'#526173'} /></View>
                  <Text style={{fontSize: 10, color: '#526173', fontWeight: feed ? '700' : undefined, marginTop: feed ? 3 : undefined}}>{labels.download}</Text>
                </TouchableOpacity>
              </>)
        }
    </>
  }

  return (
    <View>
      { loading 
        ? <ActivityIndicator size="small" color="#0000ff" className="mt-10 self-center" />
        : (renderIcon())
      }
    </View>
  );
};

export default DownloadButton;
