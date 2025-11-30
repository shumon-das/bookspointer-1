import { User } from '@/components/types/User';
import { fullBook } from '@/services/api';
import { encryptAndSaveBook, isDownloaded } from '@/app/utils/download';
import { labels } from '@/app/utils/labels';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


const DownloadButton = ({ bookId, title, author, uuid, onDownloaded }: {bookId: number; title: string; author: string; uuid: string, onDownloaded: (isSave: Boolean) => void}) => {
  const [user, setUser] = useState(null as null | User)
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)


  useEffect(() => {
    const checkIsDownloaded = async () => {
      const downloaded = await isDownloaded(bookId);
      setDownloaded(downloaded ? true : false);
    }

    checkIsDownloaded()
  })

  const onDownload = async () => {
    setLoading(true)
    const book = await fullBook(uuid);
    const path = await encryptAndSaveBook(bookId, title, author, book.content);
    if (path) {
      setLoading(false)
      onDownloaded(true);
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
                <TouchableOpacity onPress={onDownload} >
                  <Text style={{textAlign: 'center'}}><FontAwesome name="download" size={14} color={'#282C35'} /></Text>
                </TouchableOpacity>
                <Text style={{fontSize: 10, color: '#282C35'}}>{labels.download}</Text>
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
