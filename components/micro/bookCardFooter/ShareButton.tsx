import { labels } from '@/app/utils/labels';
import React from 'react';
import { View, Share, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ShareButton = ({ title, message, url, style, iconColor, variant }: {title: string; message: string; url: string, style?: any, iconColor?: string, variant?: 'feed'}) => {
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
    <View style={variant === 'feed' ? { width: '100%' } : undefined}>
      <TouchableOpacity onPress={onShare} style={style ? style : (variant === 'feed' ? { width: '100%', minHeight: 44, alignItems: 'center', justifyContent: 'center' } : { flexDirection: 'column', alignItems: 'center' })}  >
        {variant === 'feed' && <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: '#fff3e8', alignItems: 'center', justifyContent: 'center' }}><Icon name="share-alt" size={11} color="#c77a3b" /></View>}
        {variant !== 'feed' && <Icon name="share-alt" size={12} color={iconColor ? iconColor : "gray"} />}
        <Text numberOfLines={1} style={{fontSize: 9, color: variant === 'feed' ? '#8f5a2e' : (iconColor ? iconColor : "gray"), fontWeight: variant === 'feed' ? '700' : undefined, marginTop: variant === 'feed' ? 2 : undefined}}>{labels.share}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareButton;
