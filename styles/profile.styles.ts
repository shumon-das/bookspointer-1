import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cover: {
      width: '100%', 
      height: 120,
    },
    coverImg: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    userInfo: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      top: 10,
      left: 20,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: 'white',
      backgroundColor: 'white',
    },
    userImage: {
      width: '100%',
      height: '100%',
    },
    userName: {
      marginRight: 10,
      fontSize: 18,
      fontWeight: 'bold'
    },
    userRole: {
      fontSize: 12
    },
    userHeaderImg: { 
      width: 30, 
      height: 30, 
      borderRadius: 50, 
      marginHorizontal: 'auto',
      marginLeft: 12,
      borderWidth: 1,
    },
    booksLogo: {
      width: 20,
      height: 20
    },
    profileBookCard: {
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      gap: 5
    }
  })