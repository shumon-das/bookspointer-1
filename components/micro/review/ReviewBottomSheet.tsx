import { useReviewStore } from '@/app/store/reviewStore';
import labels from '@/app/utils/labels';
import { styles } from '@/styles/reviewBottomSheet';
import { Entypo } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReplyReviewCard from './ReplyReviewCard';
import ReviewCard from './ReviewCard';

interface ReviewBottomSheetProps {
  review: any;
  book: any;
  onReplyDone: (data: any) => void;
  isReply: boolean;
  isOnlyReply?: boolean;
}

const ReviewBottomSheet = forwardRef(({ review, book, onReplyDone, isReply, isOnlyReply }: ReviewBottomSheetProps, ref: any) => {
  const snapPoints = useMemo(() => ['80', '90%'], []);
  const [reply, setReply] = useState('');
  const [parentReview, setParentReview] = useState(review);
  const [reviewBook, setReviewBook] = useState(book);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isOnlyReplyReview, setIsOnlyReplyReview] = useState(isOnlyReply);
  const reviewStore = useReviewStore();

  useEffect(() => {
    setParentReview(review);
    setReviewBook(book);
    setIsOnlyReplyReview(isOnlyReply);
  }, [review, book, isReply, isOnlyReply])

  const handleReply = async () => {
    if (isEdit) {
      const data = await reviewStore.editReview(parentReview, reply);
      if (data.status) {
        setReply('');
        onReplyDone(data);
        ref.current?.close();
      }
      return;
    }

    if (isDelete) {
      const data = await reviewStore.deleteReview(parentReview.id);
      if (data.status) {
        setReply('');
        onReplyDone(data);
        ref.current?.close();
      }
      return;
    }

    const data = await reviewStore.replyToReview(parentReview.id, reviewBook.id, reply);
    if (data.status) {
      setReply('');
      onReplyDone(data);
      ref.current?.close();
    }
    return null;
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: 'white' }}
    >
      <BottomSheetView>
        <View>
          {!isReply && <ReviewCard review={parentReview} replies={[]} />}
          {isReply && <View style={{ marginHorizontal: 20 }}><ReplyReviewCard reply={parentReview} handleReply={handleReply} /></View>}
        </View>
        {isReply && <View style={{ marginHorizontal: 20 }}>
          <View>
            <TouchableOpacity style={[styles.editDeleteButton, { borderWidth: isEdit && !isDelete ? 1 : 0 }]} onPress={() => {
              setIsEdit(!isEdit)
              setReply(parentReview.content)
              setIsDelete(false)
            }}>
              <Entypo name="pencil" size={20} color="black" />
              <Text>{labels.editBook}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editDeleteButton, { borderWidth: isDelete && !isEdit ? 1 : 0 }]} onPress={() => {
              setIsDelete(!isDelete)
              setIsEdit(false)
            }}>
              <Entypo name="trash" size={20} color="black" />
              <Text>{labels.delete}</Text>
            </TouchableOpacity>
          </View>
        </View>}

        {((isOnlyReplyReview || isEdit) || (isEdit && !isReply && !isDelete)) && <View>
          <TextInput
            style={styles.input}
            onChangeText={setReply}
            value={reply}
            placeholder={labels.writeReview}
            multiline
            numberOfLines={40}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleReply} style={styles.button}>
            <Text style={styles.buttonText}>Reply</Text>
          </TouchableOpacity>
        </View>}

        {(!isReply && !isEdit) || isDelete && <View>
          <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginVertical: 20, color: 'red' }}>
            Are you sure you want to delete this review?
          </Text>
          <TouchableOpacity onPress={handleReply} style={[styles.button, { backgroundColor: 'red' }]}>
            <Text style={styles.buttonText}>Yes, Delete</Text>
          </TouchableOpacity>
        </View>}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ReviewBottomSheet;