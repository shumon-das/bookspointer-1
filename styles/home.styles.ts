import { Dimensions, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f0eb" },
  floatingLoading: { position: 'absolute', top: 200, left: (Dimensions.get('window').width / 2) - 20, backgroundColor: 'white', padding: 10, borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  list: { width: "100%" },
  listContent: { paddingBottom: 16 },
  emptyList: { flexGrow: 1 },
  emptyState: { minHeight: 320, justifyContent: "center", alignItems: "center" },
  footer: { paddingVertical: 18 },
});
