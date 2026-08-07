import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCategoryStore } from '@/app/store/categories';
import { useUserStore } from '@/app/store/userStore';
import API_CONFIG from '@/app/utils/config';

type Chapter = { id: number; title: string; content: string };

export default function WriteNewBook() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const user = useUserStore(state => state.authUser);
  const cachedCategories = useCategoryStore(state => state.categories);
  const [categories, setCategories] = useState<any[]>(cachedCategories || []);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [series, setSeries] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([{ id: 1, title: '', content: '' }]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const seriesList = useMemo(() => user?.series || [], [user?.series]);

  useLayoutEffect(() => { navigation.setOptions({ headerShown: false }); }, [navigation]);
  useEffect(() => { fetch(API_CONFIG.BASE_URL + '/categories').then(r => r.json()).then(data => setCategories(Array.isArray(data) ? data : data.categories || [])).catch(() => setError('Could not load categories.')); }, []);

  const updateChapter = (index: number, field: 'title' | 'content', value: string) => setChapters(current => current.map((chapter, i) => i === index ? { ...chapter, [field]: value } : chapter));
  const addChapter = () => { setChapters(current => [...current, { id: Date.now(), title: '', content: '' }]); setActiveChapter(chapters.length); };
  const removeChapter = (index: number) => { if (chapters.length === 1) return; setChapters(current => current.filter((_, i) => i !== index)); setActiveChapter(Math.max(0, Math.min(activeChapter, chapters.length - 2))); };
  const reset = () => Alert.alert('Reset book?', 'All title and chapter content will be cleared.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: () => { setTitle(''); setCategory(null); setSeries(null); setChapters([{ id: Date.now(), title: '', content: '' }]); setActiveChapter(0); setError(''); } }]);

  const publish = async () => {
    setError(''); setSuccess(false);
    if (!title.trim()) return setError('Book title is required.');
    if (!category) return setError('Please select a category.');
    if (chapters.some(chapter => !chapter.content.trim())) return setError('Chapter content cannot be empty.');
    const token = await AsyncStorage.getItem('auth-token');
    if (!token) return setError('You must be logged in to publish a book.');
    setSubmitting(true);
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/admin/books/create-chapters', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title.trim(), category: { id: category.id }, author: { id: user?.id }, seriesName: series?.name || '', image: 'default_post_image.jpg', chapters: chapters.map(chapter => ({ title: chapter.title.trim(), content: chapter.content.trim() })) }) });
      const data = await response.json();
      if (!data?.status) throw new Error(data?.message || 'Failed to publish.');
      setSuccess(true); setTimeout(() => router.replace('/screens/user/user-profile'), 900);
    } catch (exception: any) { setError(exception?.message || 'Network error. Please try again.'); } finally { setSubmitting(false); }
  };

  return <View style={styles.page}>
    <ScrollView contentContainerStyle={styles.padding} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.formHeader}>
          <View style={styles.headerIcon}>
            <Feather name="book-open" size={27} color="#e8d9c0" />
          </View>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10}}>
            <Text style={styles.heading}>Post a Book</Text>
            <TouchableOpacity onPress={() => router.back()} style={{borderWidth: 1, padding: 5, borderRadius: 5, borderColor: '#e8d9c0'}}>
              <FontAwesome name="home" size={20} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Share your story with readers</Text></View></View>
          <View style={styles.body}>
            <Text style={styles.label}>BOOK TITLE <Text style={styles.required}>*</Text></Text><TextInput value={title} onChangeText={value => { setTitle(value); setError(''); }} placeholder="Enter your book title..." placeholderTextColor="#b8b0a5" style={styles.input} />
            <View style={styles.fieldRow}><View style={styles.field}><Text style={styles.label}>CATEGORY <Text style={styles.required}>*</Text></Text><TouchableOpacity style={styles.select} onPress={() => setCategoryOpen(true)}><Text style={[styles.selectText, !category && styles.muted]}>{category?.label || 'Select a category...'}</Text><Feather name="chevron-down" size={16} color="#9e9488" /></TouchableOpacity></View><View style={styles.field}><Text style={styles.label}>AUTHOR <Text style={styles.required}>*</Text></Text><View style={styles.authorBox}><Text style={styles.author}>{user?.fullName || 'You'}</Text><Text style={styles.authorHint}>Published by your name</Text></View></View></View>
            <Text style={styles.label}>BOOK SERIES <Text style={styles.optional}>(optional)</Text></Text><TouchableOpacity style={styles.select} onPress={() => setSeriesOpen(true)}><Text style={[styles.selectText, !series && styles.muted]}>{series?.name || 'Select a series or leave empty...'}</Text><Feather name="chevron-down" size={16} color="#9e9488" /></TouchableOpacity>
            <View style={styles.contentHeader}><View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>Content</Text><Text style={styles.badge}>{chapters.length} {chapters.length === 1 ? 'chapter' : 'chapters'}</Text></View><TouchableOpacity style={styles.newButton} onPress={addChapter}><Feather name="plus" size={15} color="#e8d9c0" /><Text style={styles.newButtonText}>New Chapter</Text></TouchableOpacity></View>
            {chapters.map((chapter, index) => <View key={chapter.id} style={[styles.chapterCard, activeChapter === index && styles.chapterActive]}><TouchableOpacity style={styles.chapterHeader} onPress={() => setActiveChapter(activeChapter === index ? -1 : index)}><View style={styles.chapterMeta}><Text style={styles.chapterNumber}>{index + 1}</Text>{chapters.length > 1 ? <TextInput value={chapter.title} onChangeText={value => updateChapter(index, 'title', value)} placeholder={'Chapter ' + (index + 1) + ' title...'} placeholderTextColor="#b8b0a5" style={styles.chapterTitle} /> : <Text style={styles.chapterSingle}>Book Content</Text>}</View><View style={styles.chapterActions}><Text style={styles.charCount}>{chapter.content.length} chars</Text>{chapters.length > 1 && <TouchableOpacity onPress={() => removeChapter(index)}><Feather name="trash-2" size={15} color="#a09488" /></TouchableOpacity>}<Feather name={activeChapter === index ? 'chevron-up' : 'chevron-down'} size={17} color="#a09488" /></View></TouchableOpacity>{activeChapter === index && <View style={styles.chapterBody}><TextInput multiline value={chapter.content} onChangeText={value => updateChapter(index, 'content', value)} placeholder={chapters.length > 1 ? 'Write the content for this chapter...' : 'Write your book content here...'} placeholderTextColor="#c8bfb3" textAlignVertical="top" style={styles.textarea} /></View>}</View>)}
            <View style={styles.footer}><TouchableOpacity onPress={reset} style={styles.reset}><Text style={styles.resetText}>Reset</Text></TouchableOpacity><TouchableOpacity onPress={publish} disabled={submitting} style={[styles.publish, submitting && styles.disabled]}>{submitting ? <ActivityIndicator color="#e8d9c0" /> : <><Text style={styles.publishText}>Publish Book</Text><Feather name="arrow-up-right" size={17} color="#e8d9c0" /></>}</TouchableOpacity></View>
            {success && <View style={styles.success}><Feather name="check-circle" size={18} color="#2a6642" /><Text style={styles.successText}>Book published successfully!</Text></View>}{!!error && <View style={styles.error}><Feather name="alert-circle" size={18} color="#c0613a" /><Text style={styles.errorText}>{error}</Text></View>}
          </View>
      </View>
    </ScrollView>
    <Modal transparent visible={categoryOpen} animationType="slide" onRequestClose={() => setCategoryOpen(false)}><Pressable style={styles.backdrop} onPress={() => setCategoryOpen(false)}><View style={styles.sheet} onStartShouldSetResponder={() => true}><Text style={styles.sheetTitle}>Select a category</Text><ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} keyboardShouldPersistTaps="handled">{categories.map(item => <TouchableOpacity key={item.id || item.label} onPress={() => { setCategory(item); setCategoryOpen(false); }} style={styles.sheetRow}><Text style={styles.sheetText}>{item.label}</Text>{category?.id === item.id && <Feather name="check" size={17} color="#2d2926" />}</TouchableOpacity>)}</ScrollView></View></Pressable></Modal>
    <Modal transparent visible={seriesOpen} animationType="slide" onRequestClose={() => setSeriesOpen(false)}><Pressable style={styles.backdrop} onPress={() => setSeriesOpen(false)}><View style={styles.sheet} onStartShouldSetResponder={() => true}><Text style={styles.sheetTitle}>Select a series</Text><ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} keyboardShouldPersistTaps="handled"><TouchableOpacity onPress={() => { setSeries(null); setSeriesOpen(false); }} style={styles.sheetRow}><Text style={styles.sheetText}>No series</Text></TouchableOpacity>{seriesList.map((item: any) => <TouchableOpacity key={item.name} onPress={() => { setSeries(item); setSeriesOpen(false); }} style={styles.sheetRow}><Text style={styles.sheetText}>{item.name}</Text></TouchableOpacity>)}</ScrollView></View></Pressable></Modal>
  </View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f7f5f0' }, padding: { paddingBottom: 300 }, card: { backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#e8e4dc', overflow: 'hidden', elevation: 2 }, formHeader: { padding: 22, flexDirection: 'row', alignItems: 'center', gap: 16, borderBottomWidth: 1, borderBottomColor: '#f0ece4', backgroundColor: '#f4f0e8' }, headerIcon: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#2d2926', alignItems: 'center', justifyContent: 'center' }, heading: { color: '#1e1a16', fontSize: 24, fontWeight: '700' }, subtitle: { color: '#8a7f72', fontSize: 13, marginTop: 3 }, body: { padding: 20 }, label: { color: '#4a4339', fontSize: 11, fontWeight: '700', letterSpacing: .7, marginBottom: 7, marginTop: 4 }, required: { color: '#c0613a' }, optional: { color: '#9e9488', fontWeight: '400' }, input: { height: 48, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#e0d9d0', borderRadius: 10, backgroundColor: '#fafaf8', color: '#1e1a16', fontSize: 15, marginBottom: 18 }, fieldRow: { flexDirection: 'row', gap: 12 }, field: { flex: 1 }, select: { minHeight: 48, paddingHorizontal: 14, borderWidth: 1.5, borderColor: '#e0d9d0', borderRadius: 10, backgroundColor: '#fafaf8', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, selectText: { color: '#1e1a16', fontSize: 14 }, muted: { color: '#b8b0a5' }, authorBox: { minHeight: 48, padding: 10, borderWidth: 1, borderColor: '#b8ddc4', borderRadius: 10, backgroundColor: '#edf7f0', marginBottom: 16 }, author: { color: '#2a6642', fontSize: 14, fontWeight: '600' }, authorHint: { color: '#4c9165', fontSize: 10, marginTop: 2 }, contentHeader: { marginTop: 14, marginBottom: 12, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#f0ece4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 9 }, sectionTitle: { color: '#1e1a16', fontSize: 19, fontWeight: '700' }, badge: { backgroundColor: '#f0ece4', color: '#6b5f50', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 12, fontSize: 11 }, newButton: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#2d2926', borderRadius: 10 }, newButtonText: { color: '#e8d9c0', fontSize: 12, fontWeight: '600' }, chapterCard: { borderWidth: 1.5, borderColor: '#e8e4dc', borderRadius: 14, overflow: 'hidden', marginBottom: 10 }, chapterActive: { borderColor: '#c8bfb3' }, chapterHeader: { minHeight: 58, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#faf9f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, chapterMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }, chapterNumber: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#2d2926', color: '#e8d9c0', textAlign: 'center', textAlignVertical: 'center', paddingTop: 5 }, chapterTitle: { flex: 1, color: '#2d2926', fontSize: 14, padding: 0 }, chapterSingle: { color: '#4a4339', fontSize: 14, fontWeight: '600' }, chapterActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, charCount: { color: '#b8b0a5', fontSize: 10 }, chapterBody: { borderTopWidth: 1, borderTopColor: '#f0ece4' }, textarea: { minHeight: 250, padding: 16, color: '#2d2926', backgroundColor: '#fff', fontSize: 16, lineHeight: 27 }, footer: { paddingTop: 20, marginTop: 10, borderTopWidth: 1, borderTopColor: '#f0ece4', flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }, reset: { paddingHorizontal: 22, paddingVertical: 11, borderWidth: 1.5, borderColor: '#e0d9d0', borderRadius: 10 }, resetText: { color: '#6b5f50', fontWeight: '600' }, publish: { minWidth: 136, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10, backgroundColor: '#2d2926', flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' }, publishText: { color: '#e8d9c0', fontWeight: '600' }, disabled: { opacity: .6 }, success: { marginTop: 16, padding: 13, borderRadius: 10, backgroundColor: '#edf7f0', borderWidth: 1, borderColor: '#b8ddc4', flexDirection: 'row', alignItems: 'center', gap: 9 }, successText: { color: '#2a6642', fontSize: 13, fontWeight: '600' }, error: { marginTop: 16, padding: 13, borderRadius: 10, backgroundColor: '#fef2ef', borderWidth: 1, borderColor: '#f5cec4', flexDirection: 'row', alignItems: 'center', gap: 9 }, errorText: { flex: 1, color: '#c0613a', fontSize: 13 }, backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15,12,10,.35)' }, sheet: { padding: 20, paddingBottom: 34, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 }, sheetScroll: { maxHeight: 420 }, sheetScrollContent: { paddingBottom: 12 }, sheetTitle: { color: '#1e1a16', fontSize: 19, fontWeight: '700', marginBottom: 8 }, sheetRow: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0ece4', flexDirection: 'row', justifyContent: 'space-between' }, sheetText: { color: '#4a4339', fontSize: 15 },
});
