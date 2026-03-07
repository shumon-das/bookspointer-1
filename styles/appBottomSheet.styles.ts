import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#F5F5F5',
    width: '90%',
    borderRadius: 50,
    paddingHorizontal: 20,
    marginHorizontal: 'auto',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  searchItem: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchItemActions: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchItemAction: {
    marginHorizontal: 7,
  },
  searchItemText: {
    paddingBottom: 3,
    fontSize: 15,
    fontWeight: '600'
  },
  searchItemAuthor: {
    fontSize: 12,
    color: 'gray'
  }
});