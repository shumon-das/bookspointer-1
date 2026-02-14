import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 80, flexDirection: 'row', justifyContent: 'center',
        backgroundColor: '#fff',  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 }, // bottom only
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8, // Android
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    }
})