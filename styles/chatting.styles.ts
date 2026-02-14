import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FB', height: '94%', marginBottom: 40 },
  header: {
    padding: 10,
    backgroundColor: '#764ba2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#55efc4',
    marginRight: 12,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  listContent: { padding: 15, paddingBottom: 20 },
  messageBubble: {
    paddingLeft: 12,
    paddingRight: 7,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#764ba2',
    borderBottomRightRadius: 2,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  myText: { color: '#FFF', fontSize: 15, paddingBottom: 2, textAlign: 'right', marginRight: 5 },
  theirText: { color: '#333', fontSize: 15 },
  timestamp: {
    fontSize: 10,
    color: 'lightgray',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  thereTimestamp: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 15,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#764ba2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  sendButtonText: { color: '#FFF', fontWeight: 'bold' },

  // reply
  replyPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9', // Slightly off-white
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderLeftWidth: 4,
    borderLeftColor: '#764ba2', // Match your theme color
  },
  replyPreviewContent: {
    flex: 1,
    paddingLeft: 8,
  },
  replyPreviewTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#764ba2',
  },
  replyPreviewText: {
    fontSize: 14,
    color: '#666',
  },
  closeReplyButton: {
    padding: 4,
  },
  replyBarAccent: {
    width: 4,
    height: 24,
    backgroundColor: '#764ba2',
    marginRight: 8,
  },
});