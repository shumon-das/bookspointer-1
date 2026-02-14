import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    forYours: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    },
    basedOnYourReadHistory: {
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 10,
    },
    bookCard: {
        width: 150,
        height: 'auto',
        marginHorizontal: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    bookImage: {
        width: '100%',
        height: 170,
        resizeMode: 'cover',
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    bookAuthor: {
        fontSize: 12,
    },
    bookReadStatus: {
         
    },
    noBooksFound: {
        fontSize: 12,
        textAlign: 'center',
        paddingVertical: 10,
    },
})