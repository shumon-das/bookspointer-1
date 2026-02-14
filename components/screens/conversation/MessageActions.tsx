import { View, Text, Alert } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import PopOver from '@/components/micro/PopOver';
import { useConversationStore } from '@/app/store/conversationStore';
import labels from '@/app/utils/labels';

const MessageActions = ({message}: any) => {
    const popoverIcon = <FontAwesome name="chevron-down" size={14} color={message.me ? "white" : "black"} />
    const popoverMenus = message.me ? [
        { label: `Reply`, icon: <FontAwesome name="reply" size={14} color="black" /> },
        // { label: `Forward`, icon: <FontAwesome name="forward" size={14} color="black" /> },
        { label: `Edit`, icon: <FontAwesome name="edit" size={14} color="black" /> },
        { label: `Delete`, icon: <FontAwesome name="trash" size={14} color="black" /> },
    ] : [
        { label: `Reply`, icon: <FontAwesome name="reply" size={14} color="black" /> },
        // { label: `Forward`, icon: <FontAwesome name="forward" size={14} color="black" /> },
    ];

    const popoverAction = (item: any) => {
        if ('edit' === item.label.toLowerCase()) {
        useConversationStore.getState().setSelectedEditMessage(message);
        useConversationStore.getState().setSelectedReplyMessage(null);
        }

        // if ('forward' === item.label.toLowerCase()) {
        
        // }

        if ('delete' === item.label.toLowerCase()) {
            Alert.alert(labels.deleteItem.areYouSure, labels.deleteItem.deleteMessage, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => useConversationStore.getState().deleteMessage(message.id) },
            ])
        }

        if ('reply' === item.label.toLowerCase()) {
            useConversationStore.getState().setSelectedReplyMessage(message);
            useConversationStore.getState().setSelectedEditMessage(null);
        }
    }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />
    </View>
  )
}

export default MessageActions