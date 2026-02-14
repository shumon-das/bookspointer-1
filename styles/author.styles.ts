import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    headerBackgroundImage: {
        height: 170,
        width: '100%',
    },
    cover: {
        position: 'relative'
    },
    userImageAndName:{
        position: 'absolute',
        top: 95,
        left: 20,
        width: '100%',
    },
    section: {
        borderBottomWidth: 2,
        borderColor: 'lightgray',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'white'
    },
    followTotalBooksInfo: {
        marginHorizontal: 10
    },
    followTotalBooks: {
        fontWeight: '700'
    },
    followSearchButton: {
        marginHorizontal: 5,
        marginVertical: 'auto',
        paddingHorizontal: 5
    },
    followButton: {
        backgroundColor: '#085a80',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    followMessageTextBtn: {
        color: 'white'
    },
    messageButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    messageMessageTextBtn: {
        color: 'black'
    },
    followersButtonFollow: {
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 5,
    },
    followersButtonMessage: {
        alignItems: 'flex-end',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    followAndSearch: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    followersCount: {
        borderBottomWidth: 2,
        borderColor: 'lightgray',
    },
    followersCountSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    followersCountEach: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    description: {
        padding: 10
    },
    userImageCamera: {
        position: 'absolute',
        bottom: 7,
        right: 7,
        borderRadius: 20,
        padding: 4,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white'
    },
    floatingLoading: {
        position: 'absolute',
        top: 200, // Distance from top of screen
        left: (Dimensions.get('window').width / 2) - 20, // Center it
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 25,
        // Add shadow so it looks like it's floating
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
})