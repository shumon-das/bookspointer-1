import { Book } from '@/components/types/Book';
import { stripHtmlTags } from '@/app/utils/htmlNormalizer';
import { category, popoverAction } from '@/app/utils/bookCard';
import { userRole } from '@/app/utils/userRole';
import { useBookDetailsStore } from '@/app/store/bookDetailsStore';
import { useReviewStore } from '@/app/store/reviewStore';
import { useUserStore } from '@/app/store/userStore';
import { labels } from '@/app/utils/labels';
import englishNumberToBengali from '@/app/utils/englishNumberToBengali';
import API_CONFIG from '@/app/utils/config';
import { styles as cardStyles } from '@/styles/bookCard.styles';
import DownloadButton from '@/components/micro/bookCardFooter/DownloadButton';
import ShareButton from '@/components/micro/bookCardFooter/ShareButton';
import AddToLibrary from '@/components/micro/bookCardFooter/AddToLibraryButton';
import PopOver from '@/components/micro/PopOver';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Foundation } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const getImageUri = (image: string | null | undefined) => {
  const fallback = `${API_CONFIG.BASE_URL}/uploads/default_post_image.jpg`;
  if (!image) return fallback;
  if (/^https?:\/\//i.test(image)) return image;
  const normalized = image.replace(/^\/+/, '');
  return normalized.startsWith('uploads/') ? `${API_CONFIG.BASE_URL}/${normalized}` : `${API_CONFIG.BASE_URL}/uploads/${normalized}`;
};

const FeedImage = memo(({ image, style }: { image: string | null | undefined; style: object }) => {
  const fallback = `${API_CONFIG.BASE_URL}/uploads/mb_default_cover_3.jpg`;
  const [source, setSource] = useState(getImageUri(image));
  useEffect(() => { setSource(getImageUri(image)); }, [image]);
  return <Image source={{ uri: source }} style={style} onError={() => { if (source !== fallback) setSource(fallback); }} />;
});
FeedImage.displayName = 'FeedImage';

const FeedBookCard = memo(({ book, snackMessage }: { book: Book; snackMessage: (message: string) => void }) => {
  const router = useRouter();
  const authUser = useUserStore((state) => state.authUser);
  const loggedInUser = authUser;
  const authorImage = useMemo(() => getImageUri(book.createdBy?.image || 'user.png'), [book.createdBy?.image]);
  const openDetails = useCallback(() => {
    useBookDetailsStore.getState().setSelectedBook(book);
    router.push({ pathname: '/screens/book/details', params: { id: book.id, title: book.title, author: book.author.fullName, isQuote: 'no' } });
  }, [book, router]);

  const popoverMenus = loggedInUser && loggedInUser.uuid === book.createdBy.uuid
    ? [{ label: 'Edit', name: 'edit', icon: <FontAwesome name="edit" size={18} color="black" /> }]
    : [
        { label: labels.report, name: 'report', icon: <MaterialIcons name="report" size={18} color="black" /> },
        { label: labels.block, name: 'block', icon: <FontAwesome name="ban" size={18} color="black" /> },
      ];

  return (
    <View style={styles.card}>
      <View style={[cardStyles.postHeader, styles.header]}>
        <TouchableOpacity onPress={() => {
          const isCreator = useUserStore.getState().authUser?.uuid === book.createdBy.uuid;
          if (!isCreator) useUserStore.getState().setVisitUser(book.createdBy as any);
          router.push({ pathname: isCreator ? '/screens/user/user-profile' : '/screens/user/visit-user', params: { uuid: book.createdBy.uuid } });
        }}>
          <View style={styles.authorRow}>
            <FeedImage image={authorImage} style={cardStyles.image} />
            <View style={styles.authorDetails}>
              <Text style={cardStyles.userName} numberOfLines={1}>{book.createdBy?.fullName || 'Unknown author'}{authUser?.uuid === book.createdBy.uuid ? ' (You)' : ''}</Text>
              <Text style={cardStyles.userRole} numberOfLines={1}>{userRole(book.createdBy)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.menu}><PopOver icon={<MaterialIcons name="more-vert" size={24} color="black" />} menus={popoverMenus} action={(item) => popoverAction(item, loggedInUser, book, router)} /></View>
      </View>

      <TouchableOpacity onPress={openDetails} activeOpacity={0.8}>
        <View style={styles.body}>
          <FeedImage image={book.image} style={styles.bookImage} />
          <View style={styles.textBody}>
            <Text style={cardStyles.postTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={cardStyles.postAuthorName} numberOfLines={1}>{book.author?.fullName}</Text>
            <Text style={cardStyles.postCategory} numberOfLines={1}>{category(book)}</Text>
          </View>
        </View>
        <Text style={styles.preview} numberOfLines={8}>{stripHtmlTags(book.content)}</Text>
      </TouchableOpacity>

      <View style={[cardStyles.postFooter, styles.footer]}>
        <Text><DownloadButton bookId={book.id} title={book.title} author={book.author.fullName} uuid={book.uuid} onDownloaded={() => snackMessage(labels.downloadedAlready)} /></Text>
        <Text><ShareButton title="Check this out!" message={book.title} url={`https://bookspointer.com${book.url}`} /></Text>
        <Text><AddToLibrary book={book} /></Text>
        <TouchableOpacity onPress={() => { useReviewStore.getState().setSelectedBook(book); router.push({ pathname: '/screens/book/single-book-reviews' }); }}>
          <Text style={styles.reviewIcon}><Foundation name="comment-quotes" size={14} color="gray" /></Text>
          <Text style={styles.reviewText}>{englishNumberToBengali((book as any).reviewcount ?? 0)} {labels.review}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

FeedBookCard.displayName = 'FeedBookCard';
export default FeedBookCard;

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', marginVertical: 5, paddingBottom: 0 },
  header: { alignItems: 'center' },
  authorRow: { flexDirection: 'row', alignItems: 'center' },
  authorDetails: { maxWidth: 220 },
  menu: { paddingHorizontal: 20 },
  body: { flexDirection: 'row', padding: 10 },
  bookImage: { width: 64, height: 78, borderRadius: 6, backgroundColor: '#eee' },
  textBody: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  preview: { color: '#333', fontSize: 15, lineHeight: 21, paddingHorizontal: 10, paddingBottom: 10 },
  footer: { minHeight: 42 },
  reviewIcon: { textAlign: 'center' },
  reviewText: { color: '#282C35', fontSize: 10 },
});
