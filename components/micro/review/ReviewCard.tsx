import labels from '@/app/utils/labels'
import { userImageUri } from '@/app/utils/user/imageUri'
import { styles } from '@/styles/bookReview.styles'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Divider from '../Divider'
import ReplyReviewCard from './ReplyReviewCard'

interface Reivew {
  id: number;
  bookId: number;
  reviewer: {
    id: number;
    uuid: string;
    image: string;
    name: string;
    url: string;
  };
  content: string;
  rating: string;
  parent: any;
  createdAt: string;
}

interface ReviewCard {
  review: Reivew;
  replies: Reivew[];
  onPressReply?: (review: Reivew, value: boolean, isReply: boolean, isOnlyReply?: boolean) => void;
}

const ReviewCard = ({ review, replies, onPressReply }: ReviewCard) => {
  const [currentReview, setCurrentReview] = React.useState(review);
  const router = useRouter();

  useEffect(() => {
    setCurrentReview(review);
  }, [review])

  const handleReply = (r: any, value: boolean, isReply: boolean, isOnlyReply?: boolean) => {
    onPressReply?.(r, value, isReply, isOnlyReply);
  }

  const allReplies = () => {
    return (<View>
      <View><Divider label={''} color='lightgray' textColor='gray' /></View>
      {replies.map((reply: any) => (<ReplyReviewCard reply={reply} handleReply={handleReply} key={reply.id} />))}
    </View>)
  }

  const redirectToVisitorScreen = () => {
    router.push({
      pathname: '/screens/user/visit-user',
      params: { uuid: currentReview.reviewer.uuid }
    })
  }

  return (
    <View style={styles.cardContainer} key={currentReview.id}>
      {!currentReview.parent && <TouchableOpacity style={styles.header} onPress={redirectToVisitorScreen}>
        <Image source={userImageUri(currentReview.reviewer?.image ?? 'default_user.png')} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{currentReview.reviewer?.name}</Text>
          <View style={styles.ratingRow}>
            {/* {[...Array(5)].map((_, i) => (
                    <MaterialIcons key={i} name="star" size={16} color={i < currentReview.rating ? "#FFD700" : "#444"} />
                ))} */}
            <Text style={styles.dateText}>{currentReview.createdAt}</Text>
          </View>
        </View>
      </TouchableOpacity>}

      {!currentReview.parent && <Text style={styles.commentText}>{currentReview.content}</Text>}

      {replies.length > 0 && allReplies()}

      <View style={styles.buttonGroup}>
        {onPressReply && !currentReview.parent && <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleReply(currentReview, true, false, true)}>
          <Text style={styles.buttonText}>{labels.writeReply}</Text>
        </TouchableOpacity>}
      </View>
    </View>
  )
}

export default ReviewCard