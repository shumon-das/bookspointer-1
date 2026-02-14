import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bookInfo: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    margin: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: 'lightgray', 
    paddingBottom: 10
  },
  cardContainer: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  replyCardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: '90%',
    marginLeft: '10%',
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerReply: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
    width: '90%',
    marginLeft: '10%',
    padding: 10,
    borderRadius: 12,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatarReply: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerText: {
    flex: 1,
  },
  headerTextReply: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userNameReply: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    width: '100%',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dateText: {
    color: 'gray',
    fontSize: 12,
  },
  dateTextReply: {
    color: 'gray',
    fontSize: 10,
    textAlign: 'right',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentTextReply: {
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'right',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    width: '60%',
    marginLeft: '40%'
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(51, 65, 85, 0.1)'
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: 'rgba(51, 65, 85, 0.1)'
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});