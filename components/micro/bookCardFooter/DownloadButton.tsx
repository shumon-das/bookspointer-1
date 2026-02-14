import { fullBook } from '@/services/api';
import { labels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { isBookDownloaded, saveEncryptedBook } from '@/helper/details';
import { createBookMetaTable, insertBookMeta } from '@/app/utils/database/bookMetaDb';


const DownloadButton = ({ bookId, title, author, uuid, onDownloaded }: {bookId: number; title: string; author: string; uuid: string, onDownloaded: (isSave: Boolean) => void}) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const checkIsDownloaded = async () => {
      const downloaded = await isBookDownloaded(bookId)
      setDownloaded(downloaded);
    }

    checkIsDownloaded()
  })

  const onDownload = async () => {
    try {
      await createBookMetaTable()
      setLoading(true)
      const book = await fullBook(uuid);
      const downloadPath = await saveEncryptedBook(bookId, book.content);
      if (downloadPath) {
        const savedMeta = await insertBookMeta(bookId, book.uuid, book.title, book.author.fullName, book.category.label, 1, downloadPath);
      }
  
      setLoading(false)
      onDownloaded(true);
    } catch (error) {
      console.log('Error creating book meta table:', error)
      setLoading(false)
    }
  };

  const renderIcon = () => {
    return <>
        {downloaded 
            ? <>
                <Text style={{textAlign: 'center'}}><FontAwesome name="download" size={14} color={'blue'} /></Text>
                <Text style={{fontSize: 10, color: '#282C35'}}>{labels.downloadedAlready}</Text>
              </>
            : (<>
                <TouchableOpacity onPress={onDownload}>
                  <Text style={{textAlign: 'center'}}><FontAwesome name="download" size={14} color={'#282C35'} /></Text>
                  <Text style={{fontSize: 10, color: '#282C35'}}>{labels.download}</Text>
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
