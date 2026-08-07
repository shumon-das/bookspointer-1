import { fullBook } from '@/services/api';
import { labels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { isBookDownloaded, saveEncryptedBook } from '@/helper/details';
import { createBookMetaTable, insertBookMeta } from '@/app/utils/database/bookMetaDb';
import { useRouter } from 'expo-router';


const DownloadButton = ({ bookId, title, author, uuid, onDownloaded, variant }: {bookId: number; title: string; author: string; uuid: string, onDownloaded: (isSave: boolean) => void; variant?: 'feed'}) => {
  const router = useRouter();
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
        await insertBookMeta(bookId, book.uuid, book.title, book.author.fullName, book.category.label, 1, downloadPath);
      }
  
      setDownloaded(true)
      setLoading(false)
      onDownloaded(true);
    } catch (error) {
      console.log('Error creating book meta table:', error)
      setLoading(false)
    }
  };

  const onPress = () => {
    if (downloaded) {
      router.push('/download');
      return;
    }
    void onDownload();
  };

  const renderIcon = () => {
    const feed = variant === 'feed';
    return <>
        <TouchableOpacity onPress={onPress} style={feed ? { width: '100%', minHeight: 44, alignItems: 'center', justifyContent: 'center' } : undefined}>
          <View style={feed ? { width: 26, height: 26, borderRadius: 8, backgroundColor: downloaded ? '#eaf0ff' : '#eef2f7', alignItems: 'center', justifyContent: 'center' } : undefined}><FontAwesome name="download" size={13} color={downloaded ? '#5267d8' : '#526173'} /></View>
          <Text numberOfLines={1} style={{fontSize: 9, color: downloaded ? '#5267d8' : '#526173', fontWeight: feed ? '700' : undefined, marginTop: feed ? 2 : undefined}}>{downloaded ? labels.downloadedAlready : labels.download}</Text>
        </TouchableOpacity>
    </>
  }

  return (
    <View style={variant === 'feed' ? { width: '100%' } : undefined}>
      { loading 
        ? <View style={variant === 'feed' ? { width: '100%', minHeight: 44, alignItems: 'center', justifyContent: 'center' } : undefined}><ActivityIndicator size="small" color="#5267d8" /></View>
        : (renderIcon())
      }
    </View>
  );
};

export default DownloadButton;
