import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  bookImg: { 
    width: 130, 
    height: 150, 
    aspectRatio: 1, 
    resizeMode: 'contain', 
    position: 'relative',
  },
  bookInfo: {
    position: 'absolute',
    top: 0,
    bottom: 15,
    left: 0,
    right: 0,
    paddingVertical: 5,
    paddingLeft: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  likesSaves: {
    textAlign: 'center',
    fontSize: 12
  },
  category: {
    marginRight: 1,
    paddingHorizontal: 5,
    color: 'white', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'right',
    borderRadius: 10,
    fontSize: 12
  },
  cardBottom: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: 130,
  }
})