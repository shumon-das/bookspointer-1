import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Keyboard, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useReviewStore } from '@/app/store/reviewStore';
import { useUserStore } from '@/app/store/userStore';
import API_CONFIG from '@/app/utils/config';
import { userImageUri } from '@/app/utils/user/imageUri';

const EMOJIS = ['😀', '😂', '😍', '🥰', '😊', '😎', '🤩', '😢', '😮', '😡', '👏', '🙌', '👍', '❤️', '🔥', '✨', '🎉', '📚', '💡', '🙏'];

const ReviewItem = ({ review, currentUser, onEdit, onDelete, onReply, onProfile }: any) => {
  const isOwner = currentUser?.uuid && currentUser.uuid === review.reviewer?.uuid;
  return <View style={[styles.reviewCard, review.parent && styles.replyCard]}>
    {review.parent && <View style={styles.replyContext}><Feather name="corner-down-right" size={14} color="#8b7355" /><Text numberOfLines={1} style={styles.replyContextText}>Reply to {review.parent.reviewer?.name || 'a review'}</Text></View>}
    <View style={styles.reviewHeader}>
      <TouchableOpacity onPress={() => onProfile(review.reviewer?.uuid)} style={styles.reviewerInfo}>
        <Image source={userImageUri(review.reviewer?.image || 'default_user.png')} style={styles.avatar} />
        <View><Text style={styles.reviewerName}>{review.reviewer?.name || 'Reader'}</Text><Text style={styles.reviewDate}>{review.createdAt || 'Recently'}</Text></View>
      </TouchableOpacity>
      {(isOwner || currentUser?.uuid === review.bookCreatorUuid) && <View style={styles.actionRow}>{isOwner && <TouchableOpacity onPress={() => onEdit(review)} style={styles.actionButton}><Feather name="edit-2" size={15} color="#687385" /></TouchableOpacity>}{isOwner && <TouchableOpacity onPress={() => onDelete(review)} style={styles.actionButton}><Feather name="trash-2" size={15} color="#c0613a" /></TouchableOpacity>}</View>}
    </View>
    <Text style={styles.reviewText}>{review.content}</Text>
    <View style={styles.reviewFooter}><TouchableOpacity onPress={() => onReply(review)} style={styles.replyButton}><Feather name="corner-up-left" size={15} color="#3657d6" /><Text style={styles.replyText}>Reply</Text></TouchableOpacity><View style={styles.helpful}><MaterialCommunityIcons name="heart-outline" size={16} color="#9aa3ad" /><Text style={styles.helpfulText}>Helpful</Text></View></View>
  </View>;
};

export default function SingleBookReviewsRedesign() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  useLayoutEffect(() => { navigation.setOptions({ headerShown: false }); }, [navigation]);
  const selectedBook = useReviewStore(state => state.selectedBook);
  const setSelectedBook = useReviewStore(state => state.setSelectedBook);
  const currentUser = useUserStore(state => state.authUser);
  const [reviews, setReviews] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'review' | 'reply' | 'edit'>('review');
  const [actionReview, setActionReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 120);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const loadReviews = useCallback(async (refresh = false) => {
    if (!selectedBook?.id) return;
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/single-book/review/' + selectedBook.id);
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : data.reviews || []);
      setError('');
    } catch { setError('Could not load reviews. Pull down to try again.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [selectedBook?.id]);

  useFocusEffect(useCallback(() => { loadReviews(); }, [loadReviews]));
  useEffect(() => { if (!selectedBook) return; setSelectedBook(selectedBook); }, [selectedBook, setSelectedBook]);

  const totalReviews = reviews.length;
  const startReview = (nextMode: 'review' | 'reply' | 'edit', review: any = null) => { setMode(nextMode); setActionReview(review); setContent(nextMode === 'edit' ? review.content : ''); };
  const cancelMode = () => { setMode('review'); setActionReview(null); setContent(''); setEmojiOpen(false); };
  const insertEmoji = (emoji: string) => { setContent(current => current + emoji); setEmojiOpen(false); };
  const deleteReview = (review: any) => Alert.alert('Delete review?', 'This review will be removed permanently.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await useReviewStore.getState().deleteReview(review.id); setReviews(current => current.filter(item => item.id !== review.id)); } }]);
  const save = async () => {
    if (!content.trim() || submitting) return;
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) { Alert.alert('Sign in required', 'Please sign in to write a review.'); return; }
    setSubmitting(true);
    try {
      if (mode === 'reply') await useReviewStore.getState().replyToReview(actionReview.id, selectedBook.id, content.trim());
      else if (mode === 'edit') await useReviewStore.getState().editReview(actionReview, content.trim());
      else await useReviewStore.getState().createReview(selectedBook.id, content.trim());
      cancelMode(); await loadReviews(true);
    } finally { setSubmitting(false); }
  };

  if (!selectedBook) return <View style={styles.center}><Text>Book not found</Text></View>;
  const bookImage = selectedBook.image ? { uri: selectedBook.image.startsWith('http') ? selectedBook.image : API_CONFIG.BASE_URL + '/uploads/' + selectedBook.image } : require('@/assets/images/default_post_image.jpg');
  const creator = selectedBook.createdBy || {};

  return <View style={styles.screen}>
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#253041" />
      </TouchableOpacity>
      <Text style={styles.topTitle}>Reviews</Text>
      <TouchableOpacity onPress={() => loadReviews(true)} style={styles.refreshButton}>
        <Feather name="refresh-cw" size={18} color="#526173" />
      </TouchableOpacity>
    </View>
    <FlatList 
      data={reviews} 
      keyExtractor={(item, index) => String(item.id || index)} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadReviews(true)} tintColor="#3657d6" />} 
      contentContainerStyle={styles.listContent} 
      ListHeaderComponent={<View>
        <View style={styles.bookHero}>
          <Image source={bookImage} style={styles.cover} />
          <View style={styles.bookInfo}>
            <Text style={styles.eyebrow}>WHAT READERS SAY</Text>
            <Text numberOfLines={3} style={styles.bookTitle}>{selectedBook.title || 'Untitled book'}</Text>
            <Text style={styles.bookAuthor}>{selectedBook.author?.fullName || selectedBook.author || ''}</Text>
            <View style={styles.reviewCount}>
              <View style={styles.stars}>{[1, 2, 3, 4, 5].map(star => <Ionicons key={star} name="star" size={14} color="#d39b3d" />)}</View>
              <Text style={styles.countText}>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</Text>
            </View>
          </View>
          </View>
          
          {!!error && <TouchableOpacity onPress={() => loadReviews(true)} style={styles.errorBanner}><Feather name="alert-circle" size={17} color="#c0613a" /><Text style={styles.errorText}>{error}</Text></TouchableOpacity>}
          </View>} 
          renderItem={({ item }) => 
          <ReviewItem 
            review={{ ...item, bookCreatorUuid: creator.uuid }} 
            currentUser={currentUser} 
            onEdit={(review: any) => startReview('edit', review)} 
            onDelete={deleteReview} 
            onReply={(review: any) => startReview('reply', review)} 
            onProfile={(uuid: string) => uuid && router.push({ pathname: '/screens/user/visit-user', params: { uuid } })} 
            />} 
          ListEmptyComponent={
            loading ? <View style={styles.empty}>
              <ActivityIndicator size="large" color="#3657d6" />
              <Text style={styles.emptyText}>Loading reviews...</Text>
            </View> : 
            <View style={styles.empty}>
              <View style={styles.emptyIcon}><Feather name="message-circle" size={25} color="#8b7355" /></View>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptyText}>Be the first reader to share what you think.</Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: keyboardOpen ? 280 : 150 }} />}
        />
    <KeyboardStickyView style={styles.stickyComposer} offset={{ closed: 0, opened: 0 }}>
    <View style={[styles.composerWrap, { paddingBottom: keyboardOpen ? 8 : Math.max(insets.bottom, 12) }]}> 
      {emojiOpen && <View style={styles.emojiPanel}>{EMOJIS.map(emoji => <TouchableOpacity key={emoji} onPress={() => insertEmoji(emoji)} style={styles.emojiButton}><Text style={styles.emoji}>{emoji}</Text></TouchableOpacity>)}</View>}
      {mode !== 'review' && <View style={styles.modeBar}>
        <Feather name={mode === 'edit' ? 'edit-2' : 'corner-up-left'} size={15} color="#3657d6" />
        <Text style={styles.modeText}>{mode === 'edit' ? 'Editing your review' : 'Replying to ' + (actionReview?.reviewer?.name || 'reader')}</Text>
        <TouchableOpacity onPress={cancelMode} style={styles.modeClose}><Feather name="x" size={16} color="#687385" /></TouchableOpacity>
      </View>}
      <View style={styles.composer}>
        <TouchableOpacity onPress={() => setEmojiOpen(open => !open)} style={styles.emojiToggle}>
          <Feather name="smile" size={20} color={emojiOpen ? '#3657d6' : '#687385'} />
        </TouchableOpacity>
        <TextInput value={content} onChangeText={setContent} placeholder={mode === 'reply' ? 'Write a thoughtful reply...' : mode === 'edit' ? 'Update your review...' : 'Share your thoughts...'} placeholderTextColor="#9aa3ad" multiline style={styles.input} />
        <TouchableOpacity onPress={save} disabled={!content.trim() || submitting} style={[styles.sendButton, (!content.trim() || submitting) && styles.sendDisabled]}>
          {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Feather name="send" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardStickyView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f8fc' }, stickyComposer: { position: 'absolute', left: 0, right: 0, bottom: 0 }, topBar: { paddingTop: 48, paddingHorizontal: 16, paddingBottom: 13, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0f4' }, backButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f1f3f7', alignItems: 'center', justifyContent: 'center' }, topTitle: { flex: 1, textAlign: 'center', color: '#253041', fontSize: 17, fontWeight: '800' }, refreshButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, listContent: { padding: 10 }, bookHero: { padding: 16, borderRadius: 20, backgroundColor: '#253041', flexDirection: 'row', gap: 15 }, cover: { width: 86, height: 124, borderRadius: 11, backgroundColor: '#5d6878' }, bookInfo: { flex: 1, justifyContent: 'center' }, eyebrow: { color: '#b8c5db', fontSize: 10, letterSpacing: 1.2, fontWeight: '800' }, bookTitle: { color: '#fff', fontSize: 21, lineHeight: 27, fontWeight: '900', marginTop: 7 }, bookAuthor: { color: '#c5cfdf', fontSize: 12, marginTop: 6 }, reviewCount: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14 }, stars: { flexDirection: 'row', gap: 1 }, countText: { color: '#dce3ee', fontSize: 12 }, sectionHeading: { marginTop: 25, marginBottom: 13, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { color: '#253041', fontSize: 20, fontWeight: '900' }, sectionSubtitle: { color: '#8b95a3', fontSize: 12, marginTop: 3 }, writeButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3657d6', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 }, writeButtonText: { color: '#fff', fontSize: 12, fontWeight: '800' }, reviewCard: { backgroundColor: '#fff', padding: 16, borderRadius: 17, marginBottom: 12, borderWidth: 1, borderColor: '#edf0f4' }, replyCard: { borderLeftWidth: 3, borderLeftColor: '#8b7355' }, replyContext: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 11 }, replyContextText: { flex: 1, color: '#8b7355', fontSize: 11 }, reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, reviewerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 }, avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef1f5' }, reviewerName: { color: '#253041', fontSize: 14, fontWeight: '800' }, reviewDate: { color: '#9aa3ad', fontSize: 11, marginTop: 3 }, actionRow: { flexDirection: 'row', gap: 7 }, actionButton: { width: 30, height: 30, borderRadius: 9, backgroundColor: '#f5f7f9', alignItems: 'center', justifyContent: 'center' }, reviewText: { color: '#455161', fontSize: 15, lineHeight: 23, marginTop: 14 }, reviewFooter: { flexDirection: 'row', alignItems: 'center', gap: 18, marginTop: 15 }, replyButton: { flexDirection: 'row', alignItems: 'center', gap: 5 }, replyText: { color: '#3657d6', fontSize: 12, fontWeight: '700' }, helpful: { flexDirection: 'row', alignItems: 'center', gap: 5 }, helpfulText: { color: '#9aa3ad', fontSize: 12 }, composerWrap: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e8ebef', padding: 12 }, modeBar: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 }, modeText: { flex: 1, color: '#3657d6', fontSize: 12, fontWeight: '700' }, modeClose: { padding: 3 }, emojiPanel: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, marginBottom: 8, borderRadius: 14, backgroundColor: '#f5f7f9', gap: 4 }, emojiButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }, emoji: { fontSize: 23 }, emojiToggle: { width: 32, height: 38, alignItems: 'center', justifyContent: 'center', marginRight: 3 }, composer: { minHeight: 50, maxHeight: 130, borderWidth: 1, borderColor: '#dfe4ea', borderRadius: 16, paddingLeft: 14, paddingVertical: 5, flexDirection: 'row', alignItems: 'flex-end' }, input: { flex: 1, maxHeight: 108, color: '#253041', fontSize: 14, lineHeight: 20 }, sendButton: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#3657d6', alignItems: 'center', justifyContent: 'center', marginRight: 5, marginBottom: 1 }, sendDisabled: { backgroundColor: '#cbd2db' }, empty: { minHeight: 210, alignItems: 'center', justifyContent: 'center' }, emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#f0ece4', alignItems: 'center', justifyContent: 'center' }, emptyTitle: { color: '#253041', fontSize: 17, fontWeight: '800', marginTop: 12 }, emptyText: { color: '#9aa3ad', fontSize: 13, marginTop: 7 }, errorBanner: { padding: 12, borderRadius: 12, backgroundColor: '#fef2ef', flexDirection: 'row', alignItems: 'center', gap: 8 }, errorText: { flex: 1, color: '#c0613a', fontSize: 12 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
