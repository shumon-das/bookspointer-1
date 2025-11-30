import { StyleSheet } from "react-native";

export const QuoteStyles = StyleSheet.create({
  card: {
    padding: 20,
    minHeight: 200,
  },
  postHeader: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomWidth: 0.5,
      borderBottomColor: "gray",
      paddingVertical: 12,
    },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    lineHeight: 28,
  },
  author: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'right',
  },
});