import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

export default function InAppBrowser() {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url?: string }>();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const onNavigationStateChange = (state: WebViewNavigation) => {
    setCurrentUrl(state.url);
    setCanGoBack(state.canGoBack);
    setCanGoForward(state.canGoForward);
    setLoading(state.loading);
  };

  if (!url) return <View style={styles.empty}><Text>Link unavailable</Text></View>;

  return <View style={styles.screen}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.close}><Ionicons name="close" size={23} color="#253041" /></TouchableOpacity>
      <View style={styles.titleWrap}><Text style={styles.title}>In-app browser</Text><Text numberOfLines={1} style={styles.domain}>{currentUrl.replace(/^https?:\/\//, '')}</Text></View>
      <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={styles.icon}><Feather name="rotate-cw" size={18} color="#526173" /></TouchableOpacity>
    </View>
    <View style={styles.address}><Feather name="lock" size={13} color="#66806d" /><TextInput value={currentUrl} editable={false} numberOfLines={1} style={styles.addressText} /></View>
    {loading && <View style={styles.progress}><ActivityIndicator size="small" color="#3657d6" /></View>}
    <WebView ref={webViewRef} source={{ uri: url }} onLoadStart={() => setLoading(true)} onLoadEnd={() => setLoading(false)} onNavigationStateChange={onNavigationStateChange} javaScriptEnabled domStorageEnabled sharedCookiesEnabled thirdPartyCookiesEnabled startInLoadingState style={styles.webview} />
    <View style={styles.bottomBar}><TouchableOpacity disabled={!canGoBack} onPress={() => webViewRef.current?.goBack()} style={styles.bottomButton}><Feather name="chevron-left" size={23} color={canGoBack ? '#253041' : '#c5cbd3'} /></TouchableOpacity><TouchableOpacity disabled={!canGoForward} onPress={() => webViewRef.current?.goForward()} style={styles.bottomButton}><Feather name="chevron-right" size={23} color={canGoForward ? '#253041' : '#c5cbd3'} /></TouchableOpacity><View style={{ flex: 1 }} /><TouchableOpacity onPress={() => router.back()} style={styles.done}><Text style={styles.doneText}>Done</Text></TouchableOpacity></View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' }, header: { paddingTop: 48, paddingHorizontal: 14, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#edf0f4' }, close: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#f2f4f7', alignItems: 'center', justifyContent: 'center' }, titleWrap: { flex: 1, marginHorizontal: 12 }, title: { color: '#253041', fontWeight: '800', fontSize: 15 }, domain: { color: '#8a95a3', fontSize: 11, marginTop: 2 }, icon: { padding: 10 }, address: { height: 38, marginHorizontal: 14, marginVertical: 9, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#f5f7f9', flexDirection: 'row', alignItems: 'center' }, addressText: { flex: 1, color: '#667085', fontSize: 11, padding: 0, marginLeft: 7 }, progress: { height: 2, alignItems: 'center' }, webview: { flex: 1 }, bottomBar: { height: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#edf0f4', gap: 12 }, bottomButton: { padding: 6 }, done: { paddingHorizontal: 17, paddingVertical: 9, borderRadius: 10, backgroundColor: '#253041' }, doneText: { color: '#fff', fontWeight: '700', fontSize: 13 }, empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
