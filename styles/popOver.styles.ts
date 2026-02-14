import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
  popoverContainer: {
    justifyContent: 'flex-start', // top position
    alignItems: 'flex-end',       // right position
    margin: 0,
    paddingTop: 120,              // adjust to move popover vertically
    paddingRight: 40,             // adjust to move popover horizontally
  },
  popoverBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    width: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
});