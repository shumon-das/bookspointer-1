import labels from '@/app/utils/labels'
import { userImageUri } from '@/app/utils/user/imageUri'
import { styles } from '@/styles/reviewSheetReviewCard.styles'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import PopOver from '../PopOver'
import { useUserStore } from '@/app/store/userStore'
import { useReviewStore } from '@/app/store/reviewStore'

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
  bookCreator: any,
  replies: Reivew[];
  action: (review: Reivew, isEdit: boolean, isDelete: boolean, isReply: boolean, isReplyBack: boolean) => void;
}

const ReviewSheetReviewCard = ({ review, bookCreator, replies, action }: ReviewCard) => {
  const [currentReview, setCurrentReview] = React.useState(review);
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = React.useState<{ uuid: string } | null>(useUserStore.getState().authUser || null);

  useEffect(() => {
    setCurrentReview(review);
  }, [review])

  const redirectToVisitorScreen = () => {
    router.push({
      pathname: '/screens/user/visit-user',
      params: { uuid: currentReview.reviewer.uuid }
    })
  }
  const popoverIcon = <MaterialIcons name="more-vert" size={24} color="black" />
  const popoverMenus = [
    ...(currentReview.reviewer.uuid === loggedInUser?.uuid ? [{ label: labels.edit, icon: <FontAwesome name="pencil" size={18} color="black" /> }] : []),
    ...(currentReview.reviewer.uuid === loggedInUser?.uuid ? [{ label: labels.delete, icon: <FontAwesome name="trash" size={18} color="black" /> }] : []),
    ...(useReviewStore.getState().selectedBook?.createdBy?.uuid === loggedInUser?.uuid ? [{ label: labels.writeReply, icon: <FontAwesome name="reply" size={18} color="black" /> }] : []),
  ]

  const popoverAction = (item: any) => {
    if (item.label === labels.edit) {
      action(currentReview, true, false, false, false);
    } else if (item.label === labels.delete) {
      action(currentReview, false, true, false, false);
    } else if (item.label === labels.writeReply) {
      action(currentReview, false, false, true, false);
    }
  }

  return (
    <View style={[styles.cardContainer, {
      borderLeftWidth: currentReview.parent ? 2 : 0, borderLeftColor: 'gray', paddingLeft: currentReview.parent ? 5 : 0, marginBottom: currentReview.parent ? 5 : 0
      }]} key={currentReview.id}>
        {currentReview.parent && <View style={{marginBottom: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                <FontAwesome name="reply" size={12} color="black" />
                <Text style={{fontStyle: 'italic', fontSize: 12}}>Replied to {currentReview.parent.reviewer?.name}</Text>
            </View>
            <View style={{}}>
                <Text style={{fontStyle: 'italic', fontSize: 12}}>{currentReview.parent.content.slice(0, 10) + '...'}</Text>
            </View>
        </View>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.header} onPress={redirectToVisitorScreen}>
                <Image source={userImageUri(currentReview.reviewer?.image ?? 'default_user.png')} style={styles.avatar} />
                <View>
                    <Text style={styles.userName}>{currentReview.reviewer?.name}</Text>
                    <View style={styles.ratingRow}>
                    {/* {[...Array(5)].map((_, i) => (
                            <MaterialIcons key={i} name="star" size={16} color={i < currentReview.rating ? "#FFD700" : "#444"} />
                        ))} */}
                    <Text style={styles.dateText}>{currentReview.createdAt}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                {loggedInUser && popoverMenus.length > 0 &&<PopOver icon={popoverIcon} menus={popoverMenus} action={popoverAction} />}
            </TouchableOpacity>
        </View>

      <Text style={styles.commentText}>{currentReview.content}</Text>
    </View>
  )
}

export default ReviewSheetReviewCard