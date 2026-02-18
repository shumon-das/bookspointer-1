import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
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
    borderBottomColor: '#ccc'
  },
  searchItemText: {
    paddingBottom: 3,
    fontSize: 15,
    fontWeight: '600'
  },
  searchItemAuthor: {
    fontSize: 12,
    color: 'gray'
  },

  // create series sheet
   sheetHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    paddingVertical: 10 
  },
  sheetInput: {
    width: '80%', 
    borderWidth: 1, 
    borderColor: 'gray', 
    paddingHorizontal: 10, 
    paddingVertical: 10, 
    borderRadius: 10
  },
  addButton: {
    borderWidth: 1, 
    borderColor: 'gray', 
    paddingHorizontal: 20, 
    paddingVertical: 7, 
    borderRadius: 10
  },
  item: {
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderColor: 'lightgray', 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
});
