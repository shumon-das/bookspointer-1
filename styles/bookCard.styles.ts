import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    cardBackground: {
      backgroundColor: '#fff',
      marginVertical: 5,
    },
    postHeader: {
      display: 'flex',
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: "gray",
      paddingVertical: 5,
    },
    image: {
      width: 25, // Image width
      height: 25, // Image height
      borderRadius: 25, // Makes it circular
      marginLeft: 12,
      marginRight: 10, // Space between image and text
      paddingLeft: 16
    },
    userName: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    userRole: {
      fontSize: 10,
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

    feedBookImage: {
      width: 56,
      height: 70,
      borderRadius: 6,
      backgroundColor: '#eee',
    },
  
    postTitle: {
      fontSize: 18,
      fontWeight: "bold",
      // width: 220,
    },
  
    postAuthorName: {
      fontSize: 12,
      fontWeight: "bold",
    },
  
    postCategory: {
      fontSize: 10,
      fontWeight: "600"
    },
  
    postContent: {
      paddingHorizontal: 0
    },

    postPreview: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: '#333',
      fontSize: 15,
      lineHeight: 21,
    },

    postFooter: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: "space-around",
      alignItems: "center",
      paddingVertical: 2,
      borderTopWidth: 0.2,
      borderTopColor: "gray",
    },
    reviewIcon: { textAlign: 'center' },
    reviewText: { color: '#282C35', fontSize: 10 },
  })
  