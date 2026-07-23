import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { styles } from '@/styles/chatting.styles'
import Feather from '@expo/vector-icons/Feather';
import MessageActions from './MessageActions';
import { useConversationStore } from '@/app/store/conversationStore';

const Message = ({message}: any) => {
    const renderCheck = () => {
        if (message.isRead) {
            return (<View style={{flexDirection: 'row', alignItems: 'center', position: 'relative', marginTop: 2, marginLeft: 2, marginRight: 7}}>
                <Feather name="check" size={16} color="aqua" />
                <Feather name="check" size={16} color="aqua" style={{position: 'absolute', left: 6, top: 1}} />
            </View>)
        }

        if (message.isDelivered) {
            return (<View style={{flexDirection: 'row', position: 'relative', marginTop: 2, marginLeft: 2, marginRight: 7}}>
                <Feather name="check" size={16} color="lightgray" />
                <Feather name="check" size={16} color="lightgray" style={{position: 'absolute', left: 6, top: 1}} />
            </View>)
        }

        if (message.isSent) {
            return (<View style={{flexDirection: 'row', position: 'relative', marginTop: 2, marginLeft: 2, marginRight: 7}}>
                <Feather name="check" size={18} color="lightgray" />
            </View>)
        }
    }

    if (!message) {
        return <></>
    }
  return (
      <View style={[styles.messageBubble, message.me ? styles.myMessage : styles.theirMessage]}>
        {/* 1. THE REPLY PREVIEW BOX */}
        {(message.isReply || message.replyId) && (
            <View style={[
                replyStyles.replyContainer, 
                { backgroundColor: message.me ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)' }
            ]}>
                <View style={replyStyles.replyAccentBar} />
                <View style={{ paddingLeft: 8 }}>
                    <Text style={replyStyles.replySenderName}>
                    {useConversationStore.getState().selectedConversationMessages.find((msg) => msg.id === message.replyId)?.me 
                        ? 'yourself' 
                        : useConversationStore.getState().selectedConversation?.fullName
                    }
                    </Text>
                    <Text numberOfLines={1} style={replyStyles.replyTextPreview}>
                    {useConversationStore.getState().selectedConversationMessages.find((msg) => msg.id === message.replyId)?.text}
                    </Text>
                </View>
            </View>
        )}

        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: message.me ? 'flex-end' : 'space-between'}}>
            <Text style={message.me ? styles.myText : styles.theirText}>{message.text}</Text>
            <MessageActions message={message} />
        </View>
        
        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
            <Text style={message.me ? styles.timestamp : styles.thereTimestamp}>{message.time}</Text>
            {message.me && renderCheck()}
        </View>
      </View>
    )
}

export default Message

const replyStyles = StyleSheet.create({
  // ... existing styles
  replyContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  replyAccentBar: { width: 4, backgroundColor: '#7C3AED' },
  replySenderName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D28D9',
    marginBottom: 2,
  },
  replyTextPreview: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
  },
});
