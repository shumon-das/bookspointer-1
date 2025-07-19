import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cardBackground: {
      backgroundColor: "white",
      marginVertical: 5,
    },
    postHeader: {
      flex: 1,
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: "gray",
      marginBottom: 10,
      paddingVertical: 12,
    },
    image: {
      width: 40, // Image width
      height: 40, // Image height
      borderRadius: 25, // Makes it circular
      marginLeft: 12,
      marginRight: 10, // Space between image and text
      paddingLeft: 16
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    userRole: {
      fontSize: 12,
      // color: 'gray',
    },
  
    postImageAndTitle: {
      flex: 1,
      flexDirection: "row",
    },
  
    postImage: {
      width: 70,
      height: 80,
      marginRight: 12,
    },
  
    postTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
  
    postAuthorName: {
      fontSize: 12,
      fontWeight: "bold",
    },
  
    postCategory: {
      fontSize: 10,
      fontWeight: "600"
    },
  
    postBodyHeader: {
      paddingHorizontal: 10,
    },
    postContent: {
      paddingHorizontal: 0
    },

    postFooter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 6,
      borderTopWidth: 0.2,
      borderTopColor: "gray",
    }
  })
  