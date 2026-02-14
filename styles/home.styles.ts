import { Dimensions, StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    position: "relative",
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
  list: {
    width: "100%"
  },
})