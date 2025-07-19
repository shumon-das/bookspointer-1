import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    // backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  textContainer: {
    flexDirection: 'column',
    paddingVertical: 8,
    width: '90%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
});