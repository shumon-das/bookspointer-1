import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type Props = { initialContent?: string; onChange: (content: string) => void; onWordCountChange?: (count: number) => void };

const NewBookEditor = ({ initialContent = '', onChange, onWordCountChange }: Props) => {
  const webViewRef = useRef<WebView>(null);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const source = useMemo(() => ({ html: `
    <!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>*{box-sizing:border-box}body{margin:0;padding:18px 18px 150px;color:#17202a;background:#fff;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:18px;line-height:1.65}#editor{min-height:420px;outline:none}#editor:empty:before{content:'Begin your story…';color:#a4adb8}p{margin:0 0 12px}img{max-width:100%;border-radius:14px}</style>
    </head><body><div id="editor" contenteditable="true">${initialContent}</div><script>
      const editor=document.getElementById('editor');const send=()=>window.ReactNativeWebView.postMessage(JSON.stringify({html:editor.innerHTML,text:editor.innerText}));const command=(name)=>{document.execCommand(name,false,null);editor.focus();send()};window.addEventListener('message',event=>{try{command(JSON.parse(event.data).command)}catch(_){}});editor.addEventListener('input',send);editor.addEventListener('keyup',send);send();
    </script></body></html>` }), [initialContent]);
  useEffect(() => { if (pendingCommand) { webViewRef.current?.postMessage(JSON.stringify({ command: pendingCommand })); setPendingCommand(null); } }, [pendingCommand]);
  const handleMessage = (event: WebViewMessageEvent) => { try { const { html, text } = JSON.parse(event.nativeEvent.data); onChange(html); onWordCountChange?.((text || '').trim() ? text.trim().split(/\s+/).length : 0); } catch { onChange(event.nativeEvent.data); } };
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrapper}>
    <View style={styles.toolbar}><View style={styles.tools}>{(['bold', 'italic', 'underline'] as const).map(command => <TouchableOpacity key={command} accessibilityLabel={command} onPress={() => setPendingCommand(command)} style={styles.toolButton}><Feather name={command} size={18} color="#4b5563" /></TouchableOpacity>)}</View><Text style={styles.hint}>Autosaves as you write</Text></View>
    <WebView ref={webViewRef} source={source} onMessage={handleMessage} originWhitelist={['*']} javaScriptEnabled style={styles.webView} />
  </KeyboardAvoidingView>;
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' }, toolbar: { height: 52, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eef0f3', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, tools: { flexDirection: 'row', gap: 8 }, toolButton: { width: 36, height: 34, borderRadius: 10, backgroundColor: '#f3f5f7', alignItems: 'center', justifyContent: 'center' }, hint: { color: '#9aa3ad', fontSize: 12 }, webView: { flex: 1, backgroundColor: 'transparent' },
});
export default NewBookEditor;
