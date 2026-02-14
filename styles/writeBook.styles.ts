import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        height: 40,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#fff',
        borderColor: 'lightgray',
        color: '#000',
        fontSize: 14,
        fontFamily: 'Poppins',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 5
    },

    button: {
        width: '90%',
        marginHorizontal: 'auto',
        marginTop: 20,
        backgroundColor: '#085a80',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins',
    },
    registerPageSaveBtn: {
      marginBottom: 200
    },
    image: {
        width: '45%', 
        height: 150, 
        borderRadius: 5, 
        alignSelf: 'center', 
        marginTop: 20, 
        marginLeft: 20,
        position: 'relative'
    },
    imageContainer: {
      width: '45%', 
      height: 150, 
      borderWidth: 1,
      marginTop: 20, 
      marginLeft: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins',
    },
})