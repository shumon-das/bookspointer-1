import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    },

    col: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
    },

    textInput: {
        backgroundColor: '#d3d3d3', 
        width: '80%', 
        height: 40,
        borderRadius: 25,
        paddingHorizontal: 10
    },

    text: {
        height: 40, 
        lineHeight: 40
    },

    descriptionSaveButton: {
        width: '96%', 
        backgroundColor: '#0077b6', 
        flex: 1, 
        justifyContent: 'center', 
        paddingVertical: 8, 
        borderRadius: 5
    },
})