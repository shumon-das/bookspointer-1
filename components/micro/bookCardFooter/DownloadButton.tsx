import { fullBook } from '@/services/api';
import { labels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { getTotalChunks, insertBook, makeChunks } from '@/app/utils/database/manipulateBooks';


const DownloadButton = ({ bookId, title, author, uuid, onDownloaded }: {bookId: number; title: string; author: string; uuid: string, onDownloaded: (isSave: Boolean) => void}) => {
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  useEffect(() => {
    const checkIsDownloaded = async () => {
      const downloaded = await getTotalChunks(String(bookId));
      setDownloaded(downloaded > 0);
    }

    checkIsDownloaded()
  })

  const onDownload = async () => {
    setLoading(true)
    const book = await fullBook(uuid);
    const chunks = await makeChunks(book.content);
    await insertBook(String(bookId), title, author, chunks);

    setLoading(false)
    onDownloaded(true);
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
