import React from 'react';
import { View, Button, Share, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ShareButton = ({ title, message, url }: {title: string; message: string; url: string}) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: title,
        message: `${message} ${url}`, // combine message + URL
        url: url, // for iOS
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={onShare} >
        <Icon name="share-alt" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

export default ShareButton;
