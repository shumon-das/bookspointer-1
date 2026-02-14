import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { userImageUri } from '@/app/utils/user/imageUri'
import { styles } from '@/styles/bookReview.styles'
import { FontAwesome } from '@expo/vector-icons'

const ReplyReviewCard = ({reply, handleReply}: {reply: any, handleReply: (review: any, value: boolean, isReply: boolean) => void}) => {
  return (
    <View>
        <View style={styles.replyCardContainer} key={reply.id}>
            <TouchableOpacity style={styles.header} onPress={() => handleReply(reply, true, true)}>
                <Image source={ userImageUri(reply.reviewer?.image ?? 'default_user.png') } style={styles.avatarReply} />
                <View style={{width: '80%', flexDirection: 'row'}}>
                  <View style={styles.headerText}>
                    <Text style={styles.userName}>{reply.reviewer?.name}</Text>
                    <View style={styles.ratingRow}>
                        <Text style={styles.dateText}>{reply.createdAt}</Text>
                    </View>
                  </View>
                  <View>
                    <FontAwesome name="ellipsis-h" size={18} color="gray"/>
                  </View>
                </View>
            </TouchableOpacity>

            <Text style={styles.commentText}>{reply.content}</Text>
        </View>
    </View>
  )
}

export default ReplyReviewCard