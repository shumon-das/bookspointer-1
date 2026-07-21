import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '@/app/utils/config';
import { useAuthorsStore } from '@/app/store/authorStore';

type AuthorMilestone = {
  id: number; uuid?: string; fullName: string; image?: string | null; url?: string | null;
  birthAt?: string | null; deadAt?: string | null; birthWish?: string | null; deadWish?: string | null;
  milestoneType?: 'birthday' | 'memorial' | string; description?: string | null;
};
const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value.slice(0, 10) + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const cleanDescription = (value?: string | null) => {
  const description = (value || '').replace(/<[^>]*>/g, '').trim();
  return description.length > 150 ? description.slice(0, 150).trim() + '…' : description;
};
export default function AuthorMilestoneCard({ author }: { author: AuthorMilestone }) {
  const router = useRouter();
  const isMemorial = author.milestoneType === 'memorial';
  const message = isMemorial ? author.deadWish : author.birthWish;
  const image = author.image?.startsWith('http') ? author.image : API_CONFIG.BASE_URL + '/uploads/' + (author.image || 'user.png');
  const description = cleanDescription(author.description);
  const openAuthor = () => {
    useAuthorsStore.getState().setCurrentlyVisitedAuthor(author);
    router.push({ pathname: '/screens/author/author-profile', params: { authorUuid: author.uuid || '', url: author.url || '' } });
  };
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={openAuthor} style={styles.card}>
      <View style={styles.glowTop} /><View style={styles.glowBottom} />
      <View style={styles.mainRow}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: image }} style={styles.avatar} />
          <View style={styles.star}><Ionicons name="sparkles" size={16} color="#fff" /></View>
        </View>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>{isMemorial ? 'IN LOVING MEMORY' : 'AUTHOR SPOTLIGHT'}</Text>
          <Text numberOfLines={1} style={styles.name}>{author.fullName}</Text>
          {!!message && <Text numberOfLines={2} style={styles.message}>{message}</Text>}
          <View style={styles.dates}>
            {!!author.birthAt && <Text style={[styles.date, { marginRight: 6 }]}>Born {formatDate(author.birthAt)}</Text>}
            {!!author.deadAt && <Text style={styles.date}>{isMemorial ? 'Remembered' : 'Died'} {formatDate(author.deadAt)}</Text>}
          </View>
        </View>
        <Ionicons name="arrow-forward" size={25} color="#d97706" />
      </View>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: { marginHorizontal: 12, marginTop: 8, marginBottom: 14, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#f3d49a', backgroundColor: '#fffaf0', shadowColor: '#b45309', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 4 },
  glowTop: { position: 'absolute', right: -35, top: -45, width: 130, height: 130, borderRadius: 70, backgroundColor: '#fde68a', opacity: 0.45 },
  glowBottom: { position: 'absolute', left: 55, bottom: -55, width: 120, height: 120, borderRadius: 70, backgroundColor: '#fecdd3', opacity: 0.35 },
  mainRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }, avatarWrap: { position: 'relative', padding: 3, borderRadius: 50, backgroundColor: '#fbbf24' },
  avatar: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#fff', backgroundColor: '#f3f4f6' }, star: { position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', backgroundColor: '#f59e0b' },
  content: { flex: 1, minWidth: 0 }, eyebrow: { marginBottom: 3, color: '#b45309', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, name: { color: '#0f172a', fontSize: 18, fontWeight: '800' }, message: { marginTop: 3, color: '#be123c', fontSize: 13, fontWeight: '600' },
  dates: { flexDirection: 'row', justifyContent: 'flex-start' }, date: { paddingVertical: 5, borderRadius: 14, overflow: 'hidden', color: '#475569', backgroundColor: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },
  description: { borderTopWidth: 1, borderTopColor: '#f3dfb6', paddingHorizontal: 16, paddingVertical: 12, color: '#475569', fontSize: 13, lineHeight: 19 },
});
