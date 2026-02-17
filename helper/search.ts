import { StyleSheet } from "react-native";

export const searchSubjectButtonStyle = (searchSubject: string, subject: string) => {
    return {
        width: 100,
        marginHorizontal: 5,
        backgroundColor: searchSubject === subject ? '#000' : '#fff',
        padding: 10,
        borderRadius: 25,
        borderBottomWidth: 1,
        borderColor: 'lightblue'
    }
}

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: 40,
        marginTop: 40,
        marginHorizontal: 10,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'lightgray',
        borderRadius: 25
    }
})