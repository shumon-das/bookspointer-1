import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    forYours: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 0,
    },
    basedOnYourReadHistory: {
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 10,
    },
    bookCard: {
      flexDirection: 'row',
        width: '100%',
        height: 150,
        paddingHorizontal: 10,
        // backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative',
    },
    bookImage: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 12,
    },
    bookCategory: {
        fontSize: 10,
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        padding: 5,
        borderRadius: 5,
    },
    bookInfo: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        width: '70%',
    },
    bookActions: {
      flexDirection: 'row',
      gap: 10,
    },
    readButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: 5,
      borderRadius: 5,
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: 5,
      borderRadius: 5,
    },
    removeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      padding: 5,
      borderRadius: 5,
    },
    noBooksFound: {
      textAlign: 'center',
      fontSize: 14,
      paddingVertical: 10,
    }
})