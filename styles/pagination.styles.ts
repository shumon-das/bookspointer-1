import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    prevButton: {
        height: 35,
        width: 40,
        padding: 5,
        marginHorizontal: 3,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    nextButton: {
        height: 35,
        width: 45,
        padding: 5,
        marginHorizontal: 3,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    button: {
        height: 35,
        width: 35,
        padding: 5,
        marginHorizontal: 3,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'lightgray'
    },
    buttonText: {
        width: '100%',
        textAlign: 'center',
    },
    activeButton: {
        height: 35,
        width: 35,
        padding: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: 'lightgray',
        backgroundColor: '#2A74F2',
    },
    activeButtonText: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
    },
    totalPages: {
      width: 35,
      borderRadius: 5
    },
    activePageTexts: {
      fontSize: 12,
      textAlign: 'center',
      backgroundColor: '#2A74F2',
    },
    totalTexts: {
      fontSize: 12,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    nxtPrevbuttonText: {
        width: '100%',
        textAlign: 'center',
        // color: 'white',
        fontSize: 20
    }
})